import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";

export const Terms = () => {
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-12 h-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-gray-600">
            Last updated: November 20, 2025
          </p>
        </div>

        {/* Content Sections */}
        <div className="prose prose-green max-w-none space-y-8">
          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                By accessing and using Plant Saathi AI ("the Service"), you accept and agree to be bound 
                by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                Plant Saathi AI provides AI-powered agricultural insights, satellite monitoring, 
                weather forecasts, disease detection, and marketplace services to help farmers 
                make informed decisions.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>Account Creation:</strong> You must provide accurate information when creating an account.
              </p>
              <p>
                <strong>Account Security:</strong> You are responsible for maintaining the confidentiality 
                of your account credentials and for all activities under your account.
              </p>
              <p>
                <strong>Account Termination:</strong> We reserve the right to suspend or terminate accounts 
                that violate these terms.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
            <div className="space-y-3 text-gray-600">
              <p>You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Share your account with others</li>
                <li>Use automated systems to access the Service without permission</li>
                <li>Misrepresent your identity or affiliation</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                All content, features, and functionality of the Service are owned by Plant Saathi AI 
                and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                <strong>Your Data:</strong> You retain ownership of the data you provide. By using the Service, 
                you grant us a license to use your data to provide and improve our services.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Disclaimers</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>No Warranty:</strong> The Service is provided "as is" without warranties of any kind.
              </p>
              <p>
                <strong>Agricultural Advice:</strong> Our recommendations are based on data analysis and AI models. 
                They should be used as guidance, not as a substitute for professional agricultural advice.
              </p>
              <p>
                <strong>Data Accuracy:</strong> While we strive for accuracy, satellite data and weather forecasts 
                may have limitations due to cloud cover, sensor accuracy, and other factors.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                Plant Saathi AI shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of the Service, including but not limited to 
                crop losses, financial losses, or business interruption.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Pricing and Payment</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>Free Tier:</strong> Basic features are available for free.
              </p>
              <p>
                <strong>Premium Features:</strong> Some advanced features may require a subscription. 
                Pricing will be clearly communicated before purchase.
              </p>
              <p>
                <strong>Refunds:</strong> Refund policies will be specified at the time of purchase.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                We reserve the right to modify these terms at any time. We will notify users of 
                significant changes via email or through the platform. Continued use of the Service 
                after changes constitutes acceptance of the new terms.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                These terms shall be governed by and construed in accordance with the laws of India. 
                Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                For questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> legal@plantsaathi.ai</li>
                <li><strong>Phone:</strong> +91 1800-123-456</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
