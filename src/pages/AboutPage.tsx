import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sprout, ArrowLeft, Users, TrendingUp, Shield, Heart, Target, Award } from 'lucide-react';

const AboutPage = () => {
    const navigate = useNavigate();

    const metrics = [
        {
            number: "0+",
            label: "Live Farmers",
            sublabel: "(University Pilot Ongoing)"
        },
        {
            number: "85%+",
            label: "Internal Accuracy",
            sublabel: "(Pilot Data)"
        },
        {
            number: "5+",
            label: "Core Features",
            sublabel: "Live or in Beta"
        },
        {
            number: "Remote-First",
            label: "Built by student innovators",
            sublabel: ""
        }
    ];

    const values = [
        {
            icon: <Users className="w-8 h-8" />,
            title: "Farmer-First",
            description: "Every feature is designed to be practical, accessible, and usable on low-end devices."
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Innovation",
            description: "Combining on-device + cloud AI, satellite insights, and pragmatic agriculture knowledge."
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Transparency",
            description: "All numbers and accuracy metrics are internal and pilot-based — no inflated claims."
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Community-Driven",
            description: "Built with support from students, field volunteers, and early pilot participants."
        }
    ];

    const team = [
        {
            name: "Anand",
            role: "Founder & CEO",
            education: "BSc (Hons) Agriculture, 3rd Year",
            description: "Founder of Plant Saathi AI, leading product, research, and technology development."
        },
        {
            name: "Himanshi",
            role: "Research Support",
            description: "Agronomy research, content validation, pilot testing."
        },
        {
            name: "Raunak Kumar Patel",
            role: "Team Member",
            description: "Contributing to research and development."
        },
        {
            name: "Raunak Ranjan",
            role: "Team Member",
            description: "Supporting product innovation."
        },
        {
            name: "Bhawani Kumari",
            role: "Team Member",
            description: "Assisting with field operations."
        },
        {
            name: "Rajan Kumar",
            role: "Team Member",
            description: "Contributing to platform development."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-green-700 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logo.jpg" alt="Plant Saathi AI" className="w-10 h-10 rounded-lg" />
                        Plant Saathi AI
                    </div>
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </div>
            </nav>

            {/* Hero */}
            <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl font-extrabold mb-6">Empowering Indian Farmers with Practical AI</h1>
                        <p className="text-xl text-green-100 max-w-3xl mx-auto">
                            Our mission is simple: build accessible, reliable, and affordable agricultural intelligence for every smallholder farmer.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Metrics */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-4">Key Metrics (Pilot-Stage, Realistic)</h2>
                    <p className="text-center text-gray-600 mb-12">All numbers are internal/pilot-based — not commercial deployment</p>
                    <div className="grid md:grid-cols-4 gap-8">
                        {metrics.map((metric, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl font-bold text-green-600 mb-2">{metric.number}</div>
                                <div className="font-semibold text-gray-900">{metric.label}</div>
                                {metric.sublabel && <div className="text-sm text-gray-500 mt-1">{metric.sublabel}</div>}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
                    <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                        <p>
                            Plant Saathi AI was founded in <strong>2025</strong> by <strong>Anand</strong>, a BSc (Hons) Agriculture student passionate about building farmer-first technology.
                        </p>
                        <p>
                            Coming from an agriculture background and seeing firsthand how unpredictable crop diseases, input misuse, and lack of timely information affect farmers, Anand set out to build a tool that gives smallholders <strong>AI-grade guidance without complexity or cost barriers</strong>.
                        </p>
                        <p>
                            Plant Saathi AI began as a simple disease detection prototype and quickly expanded into a broader vision: <strong>one platform where any farmer can access diagnosis, soil insights, mandi prices, weather alerts, and guided decision support — all from a phone.</strong>
                        </p>
                        <p>
                            Today, Plant Saathi AI is being tested through a <strong>university pilot</strong>, with early results showing promise. The platform continues to evolve with feedback from real farmers, agronomy students, and field partners.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200"
                            >
                                <div className="text-green-600 mb-4">{value.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-700">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {team.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-green-300 transition-colors"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                                    {member.name.charAt(0)}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                <div className="text-green-600 font-semibold mb-2">{member.role}</div>
                                {member.education && (
                                    <div className="text-sm text-gray-600 mb-2">{member.education}</div>
                                )}
                                <p className="text-gray-700 text-sm">{member.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission CTA */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
                    <p className="text-xl text-green-100 mb-8">
                        Help us bring practical, trustworthy AI tools to every Indian farmer.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100 text-lg px-8" onClick={() => navigate('/auth')}>
                            Try Free Forever
                        </Button>
                        <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8" onClick={() => navigate('/contact')}>
                            Contact Us
                        </Button>
                    </div>
                    <p className="text-green-100 text-lg font-semibold">
                        Plant Saathi AI — Built in India. Farmer-First. Pilot-Tested. Growing with You.
                    </p>
                    <p className="text-sm text-green-200 mt-4">
                        plantsaathiai@gmail.com · +91 70047 41371
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
                    <p>© 2025 Plant Saathi AI. All rights reserved.</p>
                    <p className="text-sm mt-2">Remote-first · Founded 2025 · Not yet registered</p>
                </div>
            </footer>
        </div>
    );
};

export default AboutPage;
