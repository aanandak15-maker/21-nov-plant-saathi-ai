import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, ArrowLeft, Loader2, AlertTriangle, X, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DiseaseResultCard, DiseaseResult } from "./DiseaseResultCard";
import { blackBoxService } from "@/lib/blackBoxService";
import { diseaseDetectionService, DiseaseAnalysisResponse } from "@/lib/diseaseDetectionService";

type AnalysisState = "capture" | "analyzing" | "results" | "outbreak_prompt";

export const DiseaseDetectionView = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>("capture");
  const [diseaseResult, setDiseaseResult] = useState<DiseaseResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [userFields, setUserFields] = useState<Array<{ id: string; name: string }>>([]);

  // Camera related state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setApiError(null);
      setIsVideoReady(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setCameraStream(stream);
      setIsCameraOpen(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      blackBoxService.logUserInteraction('button_click', 'camera_started', undefined, {
        facingMode
      });
    } catch (err) {
      console.error("Error accessing camera:", err);
      setApiError("Could not access camera. Please allow camera permissions or use the upload option.");
      blackBoxService.logError('camera_error', err instanceof Error ? err.message : 'Unknown camera error');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setIsVideoReady(false);
  };

  const switchCamera = () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    stopCamera();
    // Small timeout to ensure stream is fully stopped before restarting
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error("Video dimensions are 0");
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to base64
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        console.log("Captured image data length:", imageDataUrl.length);
        console.log("Captured image prefix:", imageDataUrl.substring(0, 50));

        if (imageDataUrl.length < 100) {
          console.error("Captured image is too small/empty");
          setApiError("Failed to capture image. Please try again or use upload.");
          return;
        }

        setSelectedImage(imageDataUrl);
        stopCamera();

        blackBoxService.logUserInteraction('button_click', 'disease_image_captured', undefined, {
          captureMethod: 'in_app_camera',
          width: canvas.width,
          height: canvas.height,
          dataLength: imageDataUrl.length
        });
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setApiError('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setApiError('Image size too large. Please select an image smaller than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (result) {
        console.log("Uploaded image data length:", result.length);
        console.log("Uploaded image prefix:", result.substring(0, 50));

        setSelectedImage(result);
        setAnalysisState("capture");
        setApiError(null);

        blackBoxService.logUserInteraction('button_click', 'disease_image_uploaded', undefined, {
          captureMethod: 'upload',
          fileSize: file.size,
          fileType: file.type
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    blackBoxService.logUserInteraction('button_click', 'disease_retake_photo', undefined, {
      previousAnalysisState: analysisState
    });

    setSelectedImage(null);
    setAnalysisState("capture");
    setDiseaseResult(null);
    setApiError(null);
    setUserFields([]);

    // Reset file inputs
    const uploadInput = document.getElementById("upload-input") as HTMLInputElement;
    if (uploadInput) uploadInput.value = "";
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      console.error("No image selected for analysis");
      return;
    }

    console.log("Starting analysis with image length:", selectedImage.length);

    setAnalysisState("analyzing");
    setApiError(null);

    blackBoxService.logUserInteraction('button_click', 'disease_analysis_started', undefined, {
      hasImage: !!selectedImage,
      timestamp: new Date().toISOString()
    });

    try {
      const result: DiseaseAnalysisResponse = await diseaseDetectionService.analyzeDisease({
        image: selectedImage,
        crop: "rice",
        location: "India",
        symptoms: "User uploaded image"
      });

      const diseaseResult: DiseaseResult = {
        disease_name: result.disease_name,
        confidence: result.confidence,
        disease_stage: result.disease_stage || "Unknown",
        symptoms: result.affected_parts || ["Yellowing leaves", "Brown spots", "Wilting"],
        action_plan: [
          "Isolate affected plants immediately",
          "Apply recommended treatments as listed below",
          "Monitor surrounding plants daily for spread",
          "Improve field drainage and air circulation",
          "Remove and destroy severely infected plant parts"
        ],
        treatments: result.treatments,
        recommended_videos: [
          result.disease_name + " treatment",
          result.disease_name + " prevention",
          result.disease_name + " management guide"
        ],
        faqs: [
          {
            question: "How did my plants get this disease?",
            answer: "Diseases can spread through infected seeds, soil, water, wind, insects, or contaminated tools. Proper sanitation and crop rotation help prevent spread."
          },
          {
            question: "Can I save my infected plants?",
            answer: `Recovery chance is ${result.recovery_chance}. Early detection and proper treatment significantly improve outcomes. Follow the recommended treatments carefully.`
          },
          {
            question: "Will this affect my entire crop?",
            answer: `Yield impact is ${result.yield_impact}. Immediate action can minimize damage. Isolate affected areas and monitor closely.`
          },
          {
            question: "How can I prevent this in the future?",
            answer: "Use disease-resistant varieties, practice crop rotation, maintain proper spacing, ensure good drainage, and follow integrated pest management practices."
          }
        ],
        tips: result.prevention_tips && result.prevention_tips.length > 0 ? result.prevention_tips : [
          "Practice crop rotation to break disease cycles",
          "Use certified disease-free seeds and planting material",
          "Maintain proper plant spacing for air circulation",
          "Avoid overhead irrigation to reduce leaf wetness",
          "Remove and destroy infected plant debris",
          "Sanitize tools between plants to prevent spread",
          "Monitor fields regularly for early disease detection",
          "Apply preventive treatments during high-risk periods"
        ],
        yield_impact: normalizeYieldImpact(result.yield_impact),
        spread_risk: normalizeSpreadRisk(result.spread_risk || "Medium"),
        recovery_chance: normalizeRecoveryChance(result.recovery_chance),
        model_version: "PlantSaathi-Disease-API-v1.0"
      };

      setDiseaseResult(diseaseResult);

      const isHealthy = result.disease_name.toLowerCase().includes('healthy') ||
        result.disease_name.toLowerCase().includes('no disease');
      const isNotPlant = result.disease_name.toLowerCase().includes('not a plant') ||
        result.disease_name.toLowerCase().includes('invalid') ||
        result.confidence < 0.3;

      if (isHealthy || isNotPlant) {
        setAnalysisState("results");
      } else {
        setAnalysisState("outbreak_prompt");
      }

      blackBoxService.logUserInteraction('button_click', 'disease_analysis_completed', undefined, {
        diseaseName: result.disease_name,
        confidence: result.confidence,
        isHealthy,
        isNotPlant
      });

    } catch (error) {
      console.error("Analysis failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown analysis error';
      blackBoxService.logError('api_failure', errorMessage, undefined, 'disease_analysis');
      setApiError(errorMessage);
      setAnalysisState("capture");
    }
  };

  const handleOutbreakResponse = async (isOutbreak: boolean) => {
    const isHealthy = diseaseResult?.disease_name.toLowerCase().includes('healthy') ||
      diseaseResult?.disease_name.toLowerCase().includes('no disease');
    const isNotPlant = diseaseResult?.disease_name.toLowerCase().includes('not a plant') ||
      diseaseResult?.disease_name.toLowerCase().includes('invalid') ||
      (diseaseResult?.confidence || 0) < 0.3;

    if (isHealthy || isNotPlant) {
      setAnalysisState("results");
      return;
    }

    if (isOutbreak) {
      const fields = await loadUserFields();
      setUserFields(fields);

      if (fields.length === 0) {
        alert("No fields found. Please add fields first in Soil Saathi.");
        setAnalysisState("results");
      }
    } else {
      blackBoxService.logUserInteraction('button_click', 'disease_not_outbreak', undefined, {
        disease_name: diseaseResult?.disease_name
      });
      setAnalysisState("results");
    }
  };

  const handleFieldSelection = (fieldId: string, fieldName: string) => {
    if (!diseaseResult || !selectedImage) return;

    try {
      diseaseDetectionService.saveDiseaseOutbreak(
        fieldId,
        fieldName,
        diseaseResult,
        selectedImage
      );

      alert(`Disease outbreak saved to field: ${fieldName}`);
      setAnalysisState("results");

    } catch (error) {
      console.error("Failed to save outbreak:", error);
      alert("Failed to save disease outbreak. Please try again.");
    }
  };

  const loadUserFields = async (): Promise<Array<{ id: string; name: string }>> => {
    try {
      const { supabaseFieldService } = await import('@/lib/supabaseFieldService');
      const fieldsData = await supabaseFieldService.getFields();
      return fieldsData.map(field => ({
        id: field.id,
        name: field.name
      }));
    } catch (error) {
      console.error("Failed to load fields:", error);
      return [];
    }
  };

  const normalizeYieldImpact = (impact: string): "Low" | "Medium" | "High" => {
    const normalized = impact.toLowerCase();
    if (normalized.includes("low")) return "Low";
    if (normalized.includes("high")) return "High";
    return "Medium";
  };

  const normalizeSpreadRisk = (risk: string): "Low" | "Medium" | "High" => {
    const normalized = risk.toLowerCase();
    if (normalized.includes("low")) return "Low";
    if (normalized.includes("high")) return "High";
    return "Medium";
  };

  const normalizeRecoveryChance = (chance: string): "Poor" | "Fair" | "Good" | "Excellent" => {
    const normalized = chance.toLowerCase();
    if (normalized.includes("poor")) return "Poor";
    if (normalized.includes("excellent")) return "Excellent";
    if (normalized.includes("good")) return "Good";
    return "Fair";
  };

  const renderContent = () => {
    switch (analysisState) {
      case "capture":
        return (
          <div className="px-4 py-6">
            {apiError && (
              <Card className="p-4 mb-4 bg-red-50 border-2 border-red-300">
                <p className="farmer-text-base text-red-700">
                  <strong>⚠️ Error:</strong> {apiError}
                </p>
                <p className="text-sm text-red-600 mt-2">
                  Please check your connection or permissions.
                </p>
              </Card>
            )}

            {!selectedImage ? (
              <div className="space-y-6">
                {isCameraOpen ? (
                  <div className="relative bg-black rounded-lg overflow-hidden shadow-xl">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      onCanPlay={() => setIsVideoReady(true)}
                      className="w-full h-[60vh] object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Camera Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white rounded-full bg-white/20 hover:bg-white/30"
                        onClick={stopCamera}
                      >
                        <X className="w-6 h-6" />
                      </Button>

                      <button
                        onClick={captureImage}
                        disabled={!isVideoReady}
                        className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all ${isVideoReady
                            ? 'bg-white/20 hover:bg-white/40 active:scale-95 cursor-pointer'
                            : 'bg-gray-500/20 opacity-50 cursor-not-allowed'
                          }`}
                      >
                        <div className={`w-16 h-16 rounded-full ${isVideoReady ? 'bg-white' : 'bg-gray-400'}`}></div>
                      </button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white rounded-full bg-white/20 hover:bg-white/30"
                        onClick={switchCamera}
                      >
                        <RefreshCw className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Hero Section */}
                    <div className="text-center">
                      <div className="text-6xl mb-4">📸</div>
                      <h2 className="farmer-text-xl text-gray-900 mb-2">
                        {t('capture_plant_image') || 'Take Plant Photo'}
                      </h2>
                      <p className="farmer-text-base text-gray-600">
                        {t('take_clear_photo_instruction') || 'Take a clear photo of the affected plant'}
                      </p>
                    </div>

                    {/* Camera Button */}
                    <div className="flex flex-col items-center gap-4 my-8">
                      <button
                        onClick={startCamera}
                        className="group relative"
                      >
                        <div className="w-36 h-36 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 group-active:scale-95 animate-pulse group-hover:animate-none">
                          <Camera className="w-20 h-20 text-white" strokeWidth={2.5} />
                        </div>
                      </button>

                      <p className="farmer-text-lg text-gray-900 font-semibold">
                        📷 Tap to Open Camera
                      </p>

                      {/* Secondary Upload Option */}
                      <label htmlFor="upload-input" className="block">
                        <button
                          type="button"
                          className="farmer-button bg-white border-2 border-gray-300 text-gray-700 px-6 flex items-center gap-2 pointer-events-none"
                        >
                          <Upload className="w-5 h-5" />
                          <span>Or Upload Photo</span>
                        </button>
                      </label>
                      <input
                        id="upload-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>

                    {/* Photo Tips */}
                    <Card className="farmer-card bg-green-50 border-2 border-green-200">
                      <h3 className="farmer-text-lg text-green-900 mb-3 flex items-center gap-2">
                        💡 Photo Tips
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2 farmer-text-base">
                          <span className="text-xl">☀️</span>
                          <span>Good sunlight (morning is best)</span>
                        </li>
                        <li className="flex items-start gap-2 farmer-text-base">
                          <span className="text-xl">🎯</span>
                          <span>Focus on affected area</span>
                        </li>
                        <li className="flex items-start gap-2 farmer-text-base">
                          <span className="text-xl">📏</span>
                          <span>Fill the frame with leaf/plant</span>
                        </li>
                      </ul>
                    </Card>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Card className="farmer-card">
                  <img
                    src={selectedImage}
                    alt="Captured plant"
                    className="w-full rounded-lg mb-4 shadow-md"
                  />
                  <div className="space-y-3">
                    <button
                      className="farmer-button critical-action w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg"
                      onClick={handleAnalyze}
                    >
                      🔍 Analyze Disease
                    </button>
                    <button
                      className="farmer-button w-full bg-white border-2 border-gray-300 text-gray-700"
                      onClick={handleRetake}
                    >
                      🔄 Retake Photo
                    </button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        );

      case "analyzing":
        return (
          <div className="px-4 py-6">
            <Card className="farmer-card text-center">
              <Loader2 className="w-20 h-20 mx-auto mb-6 text-green-600 animate-spin" strokeWidth={2.5} />
              <h2 className="farmer-text-xl text-gray-900 mb-3">🔍 Analyzing Photo...</h2>
              <p className="farmer-text-base text-gray-600 mb-6">
                Our AI is checking your plant
              </p>
              <div className="space-y-3 text-left max-w-xs mx-auto">
                <div className="flex items-center gap-3 farmer-text-base text-gray-700">
                  <span className="text-2xl">📷</span>
                  <span>Processing image</span>
                </div>
                <div className="flex items-center gap-3 farmer-text-base text-gray-700">
                  <span className="text-2xl">🤖</span>
                  <span>Running disease detection</span>
                </div>
                <div className="flex items-center gap-3 farmer-text-base text-gray-700">
                  <span className="text-2xl">📊</span>
                  <span>Calculating confidence</span>
                </div>
              </div>
            </Card>
          </div>
        );

      case "outbreak_prompt":
        return (
          <div className="px-6 py-6">
            <Card className="p-6 bg-card">
              <div className="text-center mb-6">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                <h2 className="text-xl font-semibold mb-2">Disease Detected</h2>
                <p className="text-sm text-muted-foreground">
                  {diseaseResult?.disease_name} identified with {((diseaseResult?.confidence || 0) * 100).toFixed(0)}% confidence
                </p>
              </div>

              <div className="mb-6 p-4 bg-muted/30 rounded">
                <p className="text-sm font-medium mb-2">Is this disease outbreak in your field?</p>
                <p className="text-xs text-muted-foreground">
                  If yes, we'll save this information to your field records for tracking and management.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-destructive to-destructive/80"
                  onClick={() => handleOutbreakResponse(true)}
                >
                  Yes, It's a Field Outbreak
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOutbreakResponse(false)}
                >
                  No, Just Checking
                </Button>
              </div>

              {userFields.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Select Affected Field:</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {userFields.map((field) => (
                      <Button
                        key={field.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleFieldSelection(field.id, field.name)}
                      >
                        🌾 {field.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        );

      case "results":
        return (
          <div className="px-6 py-6">
            {diseaseResult && selectedImage && (
              <DiseaseResultCard
                result={diseaseResult}
                imageUrl={selectedImage}
                onRetake={handleRetake}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero pb-24">
      <header className="px-6 pt-8 pb-4 bg-gradient-to-r from-destructive to-destructive/80 text-white">
        <Button
          onClick={() => {
            if (isCameraOpen) {
              stopCamera();
            } else if (analysisState === "results" || analysisState === "outbreak_prompt") {
              setAnalysisState("capture");
              setDiseaseResult(null);
            } else if (analysisState === "analyzing") {
              setAnalysisState("capture");
            } else {
              navigate(-1);
            }
          }}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isCameraOpen ? "Close Camera" :
            analysisState === "results" ? "Back to Image" :
              analysisState === "outbreak_prompt" ? "Back" :
                analysisState === "analyzing" ? "Cancel" : "Back"}
        </Button>
        <h1 className="text-2xl font-bold mb-1">{t('disease_detection_title')}</h1>
        <p className="text-sm opacity-90">
          {analysisState === "capture" && !isCameraOpen && t('scan_crops_diseases')}
          {isCameraOpen && "Position plant in frame"}
          {analysisState === "analyzing" && t('analyzing_plant_image')}
          {analysisState === "outbreak_prompt" && t('field_outbreak_confirmation')}
          {analysisState === "results" && t('disease_analysis_results')}
        </p>
      </header>

      {renderContent()}
    </div>
  );
};
