import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, MapPin, MessageSquare } from "lucide-react";

export const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to our team anytime.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Email Us</h3>
                <p className="text-gray-600 text-sm">
                  For general inquiries and support
                </p>
                <a 
                  href="mailto:support@plantsaathi.ai" 
                  className="text-green-600 hover:underline text-sm font-medium"
                >
                  support@plantsaathi.ai
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Call Us</h3>
                <p className="text-gray-600 text-sm">
                  Mon-Sat, 9 AM - 6 PM IST
                </p>
                <a 
                  href="tel:+911800123456" 
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  +91 1800-123-456
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">WhatsApp</h3>
                <p className="text-gray-600 text-sm">
                  Quick support via WhatsApp
                </p>
                <a 
                  href="https://wa.me/911800123456" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline text-sm font-medium"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Visit Us</h3>
                <p className="text-gray-600 text-sm">
                  Plant Saathi AI Headquarters<br />
                  Bangalore, Karnataka, India
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-100 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">How do I get started?</h3>
              <p className="text-gray-600 text-sm">
                Simply sign up for a free account, add your fields, and start receiving AI-powered insights immediately.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Is there a mobile app?</h3>
              <p className="text-gray-600 text-sm">
                Yes! Plant Saathi AI is a Progressive Web App (PWA) that works on any device. Install it from your browser for the best experience.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">What languages are supported?</h3>
              <p className="text-gray-600 text-sm">
                We currently support English, Hindi, and Bengali, with more languages coming soon.
              </p>
            </div>

            <div className="pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">How accurate is the satellite data?</h3>
              <p className="text-gray-600 text-sm">
                We use NASA and ESA satellite data with 10-30m resolution, updated every 5-16 days depending on cloud cover.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-gray-900">Ready to Transform Your Farm?</h2>
          <Button 
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => navigate('/auth')}
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </div>
  );
};
