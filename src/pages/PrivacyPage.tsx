import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sprout } from 'lucide-react';

const PrivacyPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-green-700 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logo.jpg" alt="Plant Saathi AI" className="w-10 h-10 rounded-lg" />
                        Plant Saathi AI
                    </div>
                    <Button onClick={() => navigate('/')}>Back to Home</Button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                <p className="text-gray-600 mb-8">Last updated: November 26, 2024</p>

                <div className="prose prose-lg max-w-none">
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
                    <p className="text-gray-700 mb-4">
                        We collect information that you provide directly to us, including your name, email address, phone number, and farm details when you register for an account or use our services.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
                    <p className="text-gray-700 mb-4">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 mb-4">
                        <li>Provide, maintain, and improve our services</li>
                        <li>Send you technical notices, updates, and support messages</li>
                        <li>Respond to your comments and questions</li>
                        <li>Analyze usage patterns and trends</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h2>
                    <p className="text-gray-700 mb-4">
                        We implement industry-standard security measures including AES-256 encryption to protect your data. We are ISO 27001 certified for information security management.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Sharing</h2>
                    <p className="text-gray-700 mb-4">
                        We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating our platform, subject to strict confidentiality agreements.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Your Rights</h2>
                    <p className="text-gray-700 mb-4">
                        You have the right to access, correct, or delete your personal data. You can do this through your account settings or by contacting us at plantsaathiai@gmail.com.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Contact Us</h2>
                    <p className="text-gray-700">
                        If you have any questions about this Privacy Policy, please contact us at:
                        <br />Email: plantsaathiai@gmail.com
                        <br />Phone: +91 123 456 7890
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
