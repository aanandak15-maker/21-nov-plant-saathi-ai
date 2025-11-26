import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sprout } from 'lucide-react';

const TermsPage = () => {
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
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                <p className="text-gray-600 mb-8">Last updated: November 26, 2024</p>

                <div className="prose prose-lg max-w-none">
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-700 mb-4">
                        By accessing and using Plant Saathi AI, you accept and agree to be bound by the terms and provisions of this agreement.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Use License</h2>
                    <p className="text-gray-700 mb-4">
                        Plant Saathi AI grants you a personal, non-transferable, non-exclusive license to use our service on your devices in accordance with the terms of this agreement.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Responsibilities</h2>
                    <p className="text-gray-700 mb-4">You agree to:</p>
                    <ul className="list-disc pl-6 text-gray-700 mb-4">
                        <li>Provide accurate and complete information</li>
                        <li>Maintain the security of your account credentials</li>
                        <li>Use the service only for lawful purposes</li>
                        <li>Not attempt to reverse engineer or hack our platform</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Service Availability</h2>
                    <p className="text-gray-700 mb-4">
                        We strive for 99.9% uptime but do not guarantee uninterrupted access to our services. We reserve the right to modify or discontinue the service with or without notice.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Limitation of Liability</h2>
                    <p className="text-gray-700 mb-4">
                        Plant Saathi AI provides agricultural recommendations based on AI analysis. While we strive for accuracy, we are not responsible for crop losses or other damages resulting from use of our service. Users should verify AI recommendations with local agricultural experts.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Payment Terms</h2>
                    <p className="text-gray-700 mb-4">
                        Subscription fees are billed in advance. Refunds are provided only as described in our refund policy. You may cancel your subscription at any time.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Contact Information</h2>
                    <p className="text-gray-700">
                        For questions about these Terms, contact us at:
                        <br />Email: plantsaathiai@gmail.com
                        <br />Phone: +91 123 456 7890
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
