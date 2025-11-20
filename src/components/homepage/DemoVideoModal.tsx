import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoVideoModal = ({ isOpen, onClose }: DemoVideoModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    "Real-time satellite monitoring of your fields",
    "AI-powered disease detection and treatment",
    "16-day weather forecasts with farming alerts",
    "Smart marketplace with personalized recommendations",
    "Live mandi prices and market trends",
    "Multilingual support (English, Hindi, Bengali)"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {t('homepage.demo.title', 'See Plant Saathi AI in Action')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Placeholder */}
          <div className="relative aspect-video bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
            <div className="text-center text-white space-y-4">
              <Play className="w-16 h-16 mx-auto opacity-80" />
              <p className="text-lg font-medium">
                {t('homepage.demo.videoPlaceholder', 'Demo video coming soon!')}
              </p>
              <p className="text-sm text-green-100">
                {t('homepage.demo.tryNow', 'Try the live platform now - it\'s free!')}
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">
              {t('homepage.demo.whatYouGet', 'What you\'ll get:')}
            </h3>
            <div className="grid gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3 justify-center pt-4">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                onClose();
                navigate('/auth');
              }}
            >
              {t('homepage.demo.getStarted', 'Get Started Free')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onClose}
            >
              {t('homepage.demo.close', 'Close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
