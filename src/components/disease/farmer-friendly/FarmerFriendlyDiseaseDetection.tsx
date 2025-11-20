import { useState } from "react";
import { Camera, Upload, ArrowLeft, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { diseaseDetectionService } from "@/lib/diseaseDetectionService";
import { DiseaseResult } from "../DiseaseResultCard";

type ViewState = "guide" | "capture" | "analyzing" | "results";

export const FarmerFriendlyDiseaseDetection = () => {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<ViewState>("guide");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [diseaseResult, setDiseaseResult] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image too large. Please select an image smaller than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (result) {
        setSelectedImage(result);
        setViewState("capture");
        setError(null);
      }
    };
    reader.onerror = () => {
      setError('Failed to read image. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setViewState("analyzing");
    setError(null);

    try {
      const result = await diseaseDetectionService.analyzeDisease({
        image: selectedImage,
        crop: "rice",
        location: "India",
        symptoms: "User uploaded image"
      });

      const diseaseResult: DiseaseResult = {
        disease_name: result.disease_name,
        confidence: result.confidence,
        disease_stage: result.disease_stage || "Unknown",
        symptoms: result.affected_parts || ["Yellowing leaves", "Brown spots"],
        action_plan: [
          "Isolate affected plants immediately",
          "Apply recommended treatments",
          "Monitor surrounding plants daily"
        ],
        treatments: result.treatments,
        recommended_videos: [result.disease_name + " treatment"],
        faqs: [],
        tips: result.prevention_tips || [],
        yield_impact: normalizeYieldImpact(result.yield_impact),
        spread_risk: normalizeSpreadRisk(result.spread_risk || "Medium"),
        recovery_chance: normalizeRecoveryChance(result.recovery_chance),
        model_version: "PlantSaathi-v1.0"
      };

      setDiseaseResult(diseaseResult);
      setViewState("results");
    } catch (error) {
      console.error("Analysis failed:", error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
      setViewState("capture");
    }
  };

  const handleRetake = () => {
    setSelectedImage(null);
    setDiseaseResult(null);
    setError(null);
    setViewState("guide");
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

  const renderGuide = () => (
    <div className="space-y-4">
      {/* How It Works */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📸 How It Works</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900">Take a photo</p>
              <p className="text-sm text-gray-600">Capture the affected leaf or plant part</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900">AI analyzes</p>
              <p className="text-sm text-gray-600">Our system identifies the disease</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900">Get treatment plan</p>
              <p className="text-sm text-gray-600">Follow simple steps to cure your crop</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-3">💡 Tips for Best Results</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Use good lighting (natural daylight is best)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Capture the affected area clearly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Hold camera steady for sharp image</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Include the entire leaf if possible</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <label htmlFor="camera-input" className="block">
          <div className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 cursor-pointer hover:from-red-600 hover:to-red-700 transition-all active:scale-98 shadow-md">
            <Camera className="w-5 h-5" />
            Open Camera
          </div>
        </label>
        <input
          id="camera-input"
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageCapture}
        />

        <label htmlFor="upload-input" className="block">
          <div className="w-full py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 cursor-pointer hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all active:scale-98">
            <Upload className="w-5 h-5" />
            Upload from Gallery
          </div>
        </label>
        <input
          id="upload-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageCapture}
        />
      </div>
    </div>
  );

  const renderCapture = () => (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <img 
          src={selectedImage!} 
          alt="Captured plant" 
          className="w-full rounded-lg mb-4"
        />
        <div className="space-y-3">
          <button
            onClick={handleAnalyze}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all active:scale-98 shadow-md"
          >
            Analyze Disease
          </button>
          <button
            onClick={handleRetake}
            className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all"
          >
            Retake Photo
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
      <Loader2 className="w-16 h-16 mx-auto mb-4 text-green-600 animate-spin" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">Analyzing Image</h2>
      <p className="text-sm text-gray-600 mb-6">
        Our AI is examining your plant for diseases...
      </p>
      <div className="space-y-2 text-xs text-gray-500">
        <p>🔍 Processing image quality</p>
        <p>🧠 Running disease detection</p>
        <p>📊 Calculating confidence</p>
        <p>💡 Generating recommendations</p>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!diseaseResult) return null;

    const isHealthy = diseaseResult.disease_name.toLowerCase().includes('healthy');
    const confidence = Math.round(diseaseResult.confidence * 100);

    return (
      <div className="space-y-4">
        {/* Result Header */}
        <div className={`rounded-xl p-6 shadow-md ${
          isHealthy ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
        } text-white`}>
          <div className="flex items-center gap-3 mb-3">
            {isHealthy ? (
              <CheckCircle className="w-12 h-12" />
            ) : (
              <AlertTriangle className="w-12 h-12" />
            )}
            <div>
              <h2 className="text-2xl font-bold">{diseaseResult.disease_name}</h2>
              <p className="text-sm opacity-90">{confidence}% confidence</p>
            </div>
          </div>
        </div>

        {!isHealthy && (
          <>
            {/* Severity */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">⚠️ Severity</h3>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Yield Impact</p>
                  <p className={`font-bold ${
                    diseaseResult.yield_impact === 'High' ? 'text-red-600' :
                    diseaseResult.yield_impact === 'Medium' ? 'text-orange-600' :
                    'text-green-600'
                  }`}>{diseaseResult.yield_impact}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Spread Risk</p>
                  <p className={`font-bold ${
                    diseaseResult.spread_risk === 'High' ? 'text-red-600' :
                    diseaseResult.spread_risk === 'Medium' ? 'text-orange-600' :
                    'text-green-600'
                  }`}>{diseaseResult.spread_risk}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Recovery</p>
                  <p className={`font-bold ${
                    diseaseResult.recovery_chance === 'Excellent' || diseaseResult.recovery_chance === 'Good' ? 'text-green-600' :
                    diseaseResult.recovery_chance === 'Fair' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>{diseaseResult.recovery_chance}</p>
                </div>
              </div>
            </div>

            {/* What To Do Now */}
            <div className="bg-green-50 rounded-xl p-5 border border-green-200">
              <h3 className="font-bold text-green-900 mb-3">✅ What To Do Now</h3>
              <ol className="space-y-2">
                {diseaseResult.action_plan.slice(0, 3).map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-green-800">
                    <span className="font-bold">{idx + 1}.</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Treatments */}
            {diseaseResult.treatments && (
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">💊 Recommended Treatments</h3>
                <div className="space-y-2">
                  {diseaseResult.treatments.organic?.slice(0, 3).map((treatment, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600">•</span>
                      <span className="text-gray-700">{treatment}</span>
                    </div>
                  ))}
                  {diseaseResult.treatments.chemical?.slice(0, 2).map((treatment, idx) => (
                    <div key={`chem-${idx}`} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600">•</span>
                      <span className="text-gray-700">{treatment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/disease/details/${diseaseResult.disease_name}`)}
            className="w-full py-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all active:scale-98"
          >
            View Full Treatment Plan
          </button>
          <button
            onClick={handleRetake}
            className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all"
          >
            Check Another Plant
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50/30 to-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 shadow-lg">
        <button
          onClick={() => {
            if (viewState === "results" || viewState === "capture") {
              setViewState("guide");
              setSelectedImage(null);
              setDiseaseResult(null);
            } else {
              navigate(-1);
            }
          }}
          className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold mb-1">📸 Check Health</h1>
        <p className="text-sm text-red-50">
          {viewState === "guide" && "Detect plant diseases instantly"}
          {viewState === "capture" && "Review your photo"}
          {viewState === "analyzing" && "Analyzing your plant..."}
          {viewState === "results" && "Disease analysis results"}
        </p>
      </header>

      {/* Content */}
      <div className="p-4">
        {viewState === "guide" && renderGuide()}
        {viewState === "capture" && renderCapture()}
        {viewState === "analyzing" && renderAnalyzing()}
        {viewState === "results" && renderResults()}
      </div>
    </div>
  );
};
