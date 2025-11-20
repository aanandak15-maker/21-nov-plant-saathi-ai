import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";

export const Privacy = () => {
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
            <Shield className="w-12 h-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600">
            Last updated: November 20, 2025
          </p>
        </div>

        {/* Content Sections */}
        <div className="prose prose-green max-w-none space-y-8">
          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>Account Information:</strong> When you create an account, we collect your name, 
                email address, phone number, and location information.
              </p>
              <p>
                <strong>Field Data:</strong> We collect information about your fields including location, 
                size, crop types, and farming practices to provide personalized recommendations.
              </p>
              <p>
                <strong>Usage Data:</strong> We collect information about how you use our services, 
                including features accessed, time spent, and interactions with the platform.
              </p>
              <p>
                <strong>Device Information:</strong> We collect device type, operating system, browser type, 
                and IP address for security and optimization purposes.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <div className="space-y-3 text-gray-600">
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide personalized farming recommendations and insights</li>
                <li>Monitor your fields using satellite imagery and AI analysis</li>
                <li>Send weather alerts and critical farming notifications</li>
                <li>Improve our services and develop new features</li>
                <li>Communicate with you about your account and our services</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Sharing and Disclosure</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>We do not sell your personal information.</strong> We may share your information only in these circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> With trusted third-party services that help us operate (e.g., cloud hosting, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Aggregated Data:</strong> We may share anonymized, aggregated data for research and industry insights</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure cloud infrastructure with regular backups</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication mechanisms</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
            <div className="space-y-3 text-gray-600">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct your information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Export:</strong> Download your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                We use cookies and similar technologies to improve your experience, analyze usage, 
                and provide personalized content. You can control cookie preferences through your browser settings.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                Our services are not intended for users under 18 years of age. We do not knowingly 
                collect information from children.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                We may update this privacy policy from time to time. We will notify you of significant 
                changes via email or through the platform.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                If you have questions about this privacy policy or your data, please contact us:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> privacy@plantsaathi.ai</li>
                <li><strong>Phone:</strong> +91 1800-123-456</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
