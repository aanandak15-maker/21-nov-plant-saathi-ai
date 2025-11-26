import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Sprout, CloudSun, ShoppingCart, GraduationCap, ArrowRight,
    Leaf, Droplets, BarChart3, Brain, MapPin, TrendingUp,
    Zap, Shield, Clock, Users, Target, Star, Check, Play, X, Award
} from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
    const navigate = useNavigate();
    const [counts, setCounts] = useState({ accuracy: 0 });

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            setCounts({
                accuracy: Math.floor((85 * step) / steps)
            });
            if (step >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const features = [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Disease Detection",
            desc: "AI-powered crop disease identification",
            status: "Live",
            statusColor: "bg-green-600"
        },
        {
            icon: <Leaf className="w-6 h-6" />,
            title: "Soil Health (NDVI)",
            desc: "Satellite-based field monitoring",
            status: "Beta",
            statusColor: "bg-blue-600"
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Mandi Prices",
            desc: "Real-time market data",
            status: "Live",
            statusColor: "bg-green-600"
        },
        {
            icon: <CloudSun className="w-6 h-6" />,
            title: "Weather Intelligence",
            desc: "Hyperlocal forecasts & alerts",
            status: "Live",
            statusColor: "bg-green-600"
        },
        {
            icon: <Sprout className="w-6 h-6" />,
            title: "Crop Rotation",
            desc: "Smart rotation recommendations",
            status: "Beta",
            statusColor: "bg-blue-600"
        },
        {
            icon: <Brain className="w-6 h-6" />,
            title: "AI Assistant",
            desc: "24/7 farming advice chatbot",
            status: "Beta",
            statusColor: "bg-blue-600"
        },
        {
            icon: <Droplets className="w-6 h-6" />,
            title: "Jal Saathi",
            desc: "Irrigation scheduling",
            status: "Beta",
            statusColor: "bg-blue-600"
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: "Field Tracking",
            desc: "Complete field lifecycle",
            status: "Pilot",
            statusColor: "bg-purple-600"
        },
        {
            icon: <GraduationCap className="w-6 h-6" />,
            title: "Education Hub",
            desc: "Video tutorials & guides",
            status: "Live",
            statusColor: "bg-green-600"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Offline Mode",
            desc: "Works without internet (PWA)",
            status: "Live",
            statusColor: "bg-green-600"
        },
        {
            icon: <ShoppingCart className="w-6 h-6" />,
            title: "Smart Marketplace",
            desc: "Input supplier connections",
            status: "Coming Soon",
            statusColor: "bg-gray-600"
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "FPO Analytics",
            desc: "Farm-level insights dashboard",
            status: "FPO Only",
            statusColor: "bg-orange-600"
        }
    ];

    const pricing = [
        {
            name: "Free",
            price: "₹0",
            period: "forever",
            features: [
                "5 disease scans per day",
                "Basic crop guidance",
                "Community knowledge base",
                "Email support (72hr response)",
                "Weather alerts"
            ],
            cta: "Start Free",
            popular: false,
            note: "Perfect for smallholders"
        },
        {
            name: "Pro",
            price: "₹199",
            period: "/month",
            features: [
                "Everything in Free",
                "50 scans per day",
                "Priority WhatsApp support",
                "NDVI soil health reports",
                "Crop rotation planner",
                "Downloadable PDF reports",
                "Offline field maps"
            ],
            cta: "Subscribe Now",
            popular: true,
            note: "Most farmers choose this"
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "pricing",
            features: [
                "Everything in Pro",
                "Unlimited scans",
                "FPO analytics dashboard",
                "Bulk API access",
                "SLA-backed support",
                "Training & onboarding",
                "Custom integrations"
            ],
            cta: "Contact Sales",
            popular: false,
            note: "For FBOs and large farms"
        }
    ];

    const testimonials = [
        {
            name: "Pilot Participant",
            role: "Tomato Farmer, Eastern India",
            text: "PlantSaathi's disease scan reduced visible leaf damage in my tomato plot — estimated loss down ≈18% in 2 weeks.",
            rating: 5,
            impact: "~18% loss reduction"
        },
        {
            name: "Pilot Participant",
            role: "Rice Farmer, Bihar",
            text: "SoilSaathi report helped me adjust NPK timing; I saw healthier tillers in rice — early pilot result.",
            rating: 5,
            impact: "Healthier crop"
        },
        {
            name: "Pilot Participant",
            role: "Mixed Vegetables, North India",
            text: "Quick scan and clear advice saved a week of guesswork during pest outbreak.",
            rating: 5,
            impact: "Week saved"
        },
    ];

    const faqs = [
        {
            question: "How much does it cost?",
            answer: "We offer a forever-free plan with 5 scans/day. Our Pro plan is ₹199/month with 50 scans/day and priority support. No automatic renewals without your consent."
        },
        {
            question: "Does it work offline?",
            answer: "Yes! Our PWA (Progressive Web App) works offline. You can access critical features like saved scans and field data without internet. Data syncs when you're back online."
        },
        {
            question: "How accurate is disease detection?",
            answer: "Our AI shows &gt;85% accuracy in university pilot testing. This is internal pilot data and not independently verified yet. We're continuously improving accuracy with more training data."
        },
        {
            question: "Is this only for large farms?",
            answer: "No! Plant Saathi AI is built specifically for smallholder farmers. Our Free plan is forever free and designed for small farms. Upgrade to Pro when needed."
        },
        {
            question: "Is my farm data secure?",
            answer: "Yes. We use industry-standard encryption and never sell your data. Contact plantsaathiai@gmail.com for data deletion requests."
        },
        {
            question: "Do you provide support in Hindi?",
            answer: "Yes! Our AI assistant works in Hindi, English, and regional languages. WhatsApp support is available for Pro subscribers."
        },
        {
            question: "Which crops does Plant Saathi AI support?",
            answer: "We support all major Indian crops including rice, wheat, cotton, sugarcane, tomato, potato, chilli, maize, soybean, and 20+ other crops. Our disease database covers 100+ common crop diseases specific to Indian agriculture."
        },
        {
            question: "How does satellite NDVI soil monitoring work?",
            answer: "We use free Sentinel-2 satellite imagery to calculate NDVI (Normalized Difference Vegetation Index) for your fields. This shows crop health, growth patterns, and stress zones without expensive equipment. Updates every 3-5 days based on cloud cover."
        },
        {
            question: "Can the app be used in offline rural areas?",
            answer: "Absolutely! Our Progressive Web App (PWA) works fully offline after first installation. You can scan crops, view saved data, and access field information without internet. Data automatically syncs when you're back online."
        },
        {
            question: "What government schemes does Plant Saathi integrate with?",
            answer: "We provide information on PM-KISAN, Soil Health Card, Pradhan Mantri Fasal Bima Yojana (crop insurance), and other central schemes. Pro users get personalized scheme recommendations based on their crop and location."
        },
        {
            question: "How accurate is the AI for different Indian regions?",
            answer: "Our pilot testing shows >85% accuracy across North and East India. We're continuously training on data from Punjab, Haryana, UP, Bihar, and other states. Accuracy varies by region and crop - we're transparent about limitations."
        },
        {
            question: "Can I use Plant Saathi for large farms too?",
            answer: "Yes! While designed for smallholders, our Pro and Enterprise plans support unlimited field tracking. Large farms benefit from satellite monitoring, bulk disease scanning, and advanced analytics. Contact us for custom enterprise pricing."
        },
        {
            question: "How do I upgrade from Free to Pro plan?",
            answer: "Simply go to Profile → Upgrade in the app. Pay via UPI, Google Pay, or card. Instant activation. Upgrade or downgrade anytime. No long-term contracts. 7-day refund available for annual plans."
        },
        {
            question: "What languages are supported besides Hindi?",
            answer: "Currently: English, Hindi, Punjabi, and Bengali. Coming soon: Tamil, Telugu, Marathi, Gujarati. Our AI assistant understands conversational queries in all supported languages for better farmer accessibility."
        },
        {
            question: "How to troubleshoot if disease detection isn't working?",
            answer: "Common fixes: 1) Ensure good lighting (natural daylight works best), 2) Focus camera on affected leaf/plant part, 3) Clean camera lens, 4) Check internet connection for cloud AI, 5) Update to latest app version. Contact support@plantsaathiai.com if issues persist."
        }
    ];

    const recognitions = [
        "Smart India Hackathon 2025",
        "Chitkara Incubation Centre"
    ];

    return (
        <div className="min-h-screen bg-white overflow-x-hidden font-sans">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-green-700 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logo.jpg" alt="Plant Saathi AI" className="w-10 h-10" />
                        Plant Saathi AI
                    </div>
                    <div className="hidden md:flex gap-8 items-center">
                        <a href="#features" className="text-gray-600 hover:text-green-700 font-medium">Features</a>
                        <a href="#pricing" className="text-gray-600 hover:text-green-700 font-medium">Pricing</a>
                        <span onClick={() => navigate('/blog')} className="text-gray-600 hover:text-green-700 font-medium cursor-pointer">Blog</span>
                        <span onClick={() => navigate('/about')} className="text-gray-600 hover:text-green-700 font-medium cursor-pointer">About</span>
                        <Button variant="ghost" onClick={() => navigate('/auth')}>Sign In</Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => navigate('/auth')}>
                            Try Free
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            🌱 University Pilot in Progress
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                            Practical AI for <span className="text-green-600">Smallholder Farming</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Quick disease scans on mobile. Satellite-backed soil health. Pilot-validated agronomy — made for small farms.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6" onClick={() => navigate('/auth')}>
                                Try Free Forever <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-lg px-8 py-6 border-2 border-green-600 text-green-700 hover:bg-green-50"
                                onClick={() => window.open('https://www.youtube.com/@plantsaathiai', '_blank')}
                            >
                                <Play className="mr-2 w-5 h-5" /> Watch Demo
                            </Button>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-green-600" />
                                Forever free plan
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-green-600" />
                                No credit card needed
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl p-2 border-4 border-gray-100">
                            <img
                                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop"
                                alt="Plant Saathi AI Mobile App"
                                className="w-full h-auto rounded-xl"
                            />
                        </div>
                        <div className="absolute -top-4 -left-4 bg-white p-4 rounded-lg shadow-lg">
                            <div className="text-3xl font-bold text-green-600">{counts.accuracy}%+</div>
                            <div className="text-sm text-gray-600">Pilot Accuracy</div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                            <div className="text-3xl font-bold text-blue-600">₹199</div>
                            <div className="text-sm text-gray-600">Pro Plan/Month</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trust Bar */}
            <section className="bg-white border-y border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-gray-500 text-sm mb-4">RECOGNIZED BY</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                        {recognitions.map((rec, i) => (
                            <div key={i} className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                                <Award className="w-5 h-5 text-green-600" />
                                {rec}
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-4">
                        *Pilot data — &gt;85% accuracy (internal). University pilot ongoing. Not independently verified.
                    </p>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Farming Suite</h2>
                        <p className="text-xl text-gray-600">Tools designed for Indian smallholder farmers</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-green-200 hover:shadow-lg transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-green-100 text-green-700 p-3 rounded-lg">
                                        {f.icon}
                                    </div>
                                    <span className={`${f.statusColor} text-white px-2 py-1 rounded text-xs font-bold`}>
                                        {f.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-gray-600">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Plant Saathi AI?</h2>
                        <p className="text-xl text-gray-600">See how we stack up against alternatives</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white shadow-xl rounded-2xl overflow-hidden">
                            <thead>
                                <tr className="bg-gradient-to-r from-green-600 to-green-700">
                                    <th className="p-6 text-left text-white font-bold text-lg">Feature</th>
                                    <th className="p-6 text-center text-white font-bold text-lg bg-green-700 border-x-4 border-green-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <img src="/logo.jpg" alt="Plant Saathi AI" className="w-12 h-12 rounded-lg" />
                                            <span>Plant Saathi AI</span>
                                            <span className="text-xs bg-green-400 text-green-900 px-2 py-1 rounded-full">OUR SOLUTION</span>
                                        </div>
                                    </th>
                                    <th className="p-6 text-center text-white font-bold text-lg">Traditional Extension</th>
                                    <th className="p-6 text-center text-white font-bold text-lg">Other Agri-Tech Apps</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Pricing */}
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-6 font-semibold text-gray-900">💰 Forever Free Plan</td>
                                    <td className="p-6 text-center bg-green-50 border-x-4 border-green-200">
                                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                                        <p className="text-sm text-gray-600 mt-1">5 scans/day forever</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className="text-gray-400">—</span>
                                        <p className="text-sm text-gray-500 mt-1">Govt subsidized only</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <X className="w-6 h-6 text-red-500 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-1">Paid subscription needed</p>
                                    </td>
                                </tr>

                                {/* Affordability */}
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-6 font-semibold text-gray-900">💵 Pro Plan Pricing</td>
                                    <td className="p-6 text-center bg-green-50 border-x-4 border-green-200">
                                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                                        <p className="text-sm font-bold text-green-700 mt-1">₹199/month</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className="text-gray-400">—</span>
                                        <p className="text-sm text-gray-500 mt-1">Free but limited reach</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <X className="w-6 h-6 text-red-500 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-1">₹500-2000/month</p>
                                    </td>
                                </tr>

                                {/* Offline Support */}
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-6 font-semibold text-gray-900">📱 Offline Access (PWA)</td>
                                    <td className="p-6 text-center bg-green-50 border-x-4 border-green-200">
                                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                                        <p className="text-sm text-gray-600 mt-1">Full offline mode</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-1">In-person visits</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <X className="w-6 h-6 text-red-500 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-1">Internet required</p>
                                    </td>
                                </tr>

                                {/* Accuracy */}
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-6 font-semibold text-gray-900">🎯 AI Accuracy</td>
                                    <td className="p-6 text-center bg-green-50 border-x-4 border-green-200">
                                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                                        <p className="text-sm font-bold text-green-700 mt-1">&gt;85% (Pilot)</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className="text-gray-400">—</span>
                                        <p className="text-sm text-gray-500 mt-1">Expert-dependent</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className="text-gray-400">~</span>
                                        <p className="text-sm text-gray-500 mt-1">Varies 60-90%</p>
                                    </td>
                                </tr>

                                {/* Multi-language */}
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-6 font-semibold text-gray-900">🗣️ Language Support</td>
                                    <td className="p-6 text-center bg-green-50 border-x-4 border-green-200">
                                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                                        <p className="text-sm text-gray-600 mt-1">Hindi, English + more</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-1">Regional languages</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <X className="w-6 h-6 text-red-500 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-1">English only mostly</p>
                                    </td>
                                </tr>

                                {/* All-in-One */}
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-6 font-semibold text-gray-900">🎁 All-in-One Platform</td>
                                    <td className="p-6 text-center bg-green-50 border-x-4 border-green-200">
                                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                                        <p className="text-sm text-gray-600 mt-1">12 features integrated</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <X className="w-6 h-6 text-red-500 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-1">Fragmented services</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <X className="w-6 h-6 text-red-500 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-1">Single-feature apps</p>
                                    </td>
                                </tr>

                                {/* Satellite Data */}
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-6 font-semibold text-gray-900">🛰️ Satellite NDVI Soil Health</td>
                                    <td className="p-6 text-center bg-green-50 border-x-4 border-green-200">
                                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                                        <p className="text-sm text-gray-600 mt-1">Free for all users</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <X className="w-6 h-6 text-red-500 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-1">Not available</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className="text-gray-400">~</span>
                                        <p className="text-sm text-gray-500 mt-1">Premium feature</p>
                                    </td>
                                </tr>

                                {/* Built for Smallholders */}
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-6 font-semibold text-gray-900">👨‍🌾 Built for Smallholders</td>
                                    <td className="p-6 text-center bg-green-50 border-x-4 border-green-200">
                                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                                        <p className="text-sm text-gray-600 mt-1">Core design principle</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-1">Traditional focus</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <X className="w-6 h-6 text-red-500 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-1">Large farm focus</p>
                                    </td>
                                </tr>

                                {/* 24/7 Availability */}
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-6 font-semibold text-gray-900">⏰ 24/7 AI Assistant</td>
                                    <td className="p-6 text-center bg-green-50 border-x-4 border-green-200">
                                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                                        <p className="text-sm text-gray-600 mt-1">Always available</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <X className="w-6 h-6 text-red-500 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-1">Office hours only</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className="text-gray-400">~</span>
                                        <p className="text-sm text-gray-500 mt-1">Limited chatbot</p>
                                    </td>
                                </tr>

                                {/* University Validated */}
                                <tr className="hover:bg-gray-50">
                                    <td className="p-6 font-semibold text-gray-900">🎓 University Pilot Validated</td>
                                    <td className="p-6 text-center bg-green-50 border-x-4 border-green-200">
                                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                                        <p className="text-sm text-gray-600 mt-1">Ongoing validation</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-1">Govt backed</p>
                                    </td>
                                    <td className="p-6 text-center">
                                        <X className="w-6 h-6 text-red-500 mx-auto" />
                                        <p className="text-sm text-gray-500 mt-1">No validation</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                        <p className="text-lg font-semibold text-gray-900 mb-2">
                            🌟 The only platform combining affordability, accuracy, and comprehensive features for smallholder farmers
                        </p>
                        <p className="text-gray-600">
                            Built by farmers, for farmers. No hidden costs, no complexity.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Farmer-Friendly Pricing</h2>
                        <p className="text-xl text-gray-600">Start free. Upgrade when ready.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {pricing.map((plan, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`bg-white rounded-2xl p-8 border-2 ${plan.popular ? 'border-green-500 shadow-xl scale-105' : 'border-gray-200'} relative`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                        MOST POPULAR
                                    </div>
                                )}
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                        <span className="text-gray-600">{plan.period}</span>
                                    </div>
                                    <p className="text-sm text-green-700 font-medium">{plan.note}</p>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="flex items-start gap-2">
                                            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className={`w-full ${plan.popular ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                                    onClick={() => navigate('/auth')}
                                >
                                    {plan.cta}
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    <p className="text-center text-gray-600 mt-8 text-sm">
                        No automatic renewals. UPI/Google Pay/Card accepted. 7-day refund for annual plans (terms apply).
                    </p>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Early Pilot Results</h2>
                        <p className="text-xl text-gray-600">Real feedback from university pilot participants</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-6 border-2 border-gray-200"
                            >
                                <div className="flex gap-1 mb-4 text-yellow-400">
                                    {[...Array(t.rating)].map((_, i) => <Star key={i} fill="currentColor" className="w-5 h-5" />)}
                                </div>
                                <p className="text-gray-700 mb-6 italic">"{t.text}"</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-gray-900">{t.name}</div>
                                        <div className="text-sm text-gray-600">{t.role}</div>
                                    </div>
                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                        {t.impact}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-8">
                        *Pilot-reported, anecdotal results. Not statistically validated. Individual results may vary.
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-600">Everything you need to know</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="bg-gray-50 border-2 border-gray-200 rounded-lg px-6">
                                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-green-700 py-4">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pb-4">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
                <div className="max-w-4xl mx-auto px-6 text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Try Plant Saathi AI?
                    </h2>
                    <p className="text-xl mb-8 text-green-100">
                        Start with our forever-free plan. No credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100 text-lg px-10 py-6 font-bold" onClick={() => navigate('/auth')}>
                            Start Free <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-6" onClick={() => navigate('/contact')}>
                            Contact Us
                        </Button>
                    </div>
                    <p className="text-sm text-green-100">Free forever · No credit card · Email: plantsaathiai@gmail.com</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 text-2xl font-bold mb-4">
                            <img src="/logo.jpg" alt="Plant Saathi AI" className="w-10 h-10 rounded-lg" />
                            Plant Saathi AI
                        </div>
                        <p className="text-gray-400 mb-4">Practical AI for smallholder farming. Remote-first. University pilot ongoing.</p>
                        <p className="text-sm text-gray-500">Founded 2025 · Not yet registered</p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Product</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#features" className="hover:text-white">Features</a></li>
                            <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                            <li className="hover:text-white cursor-pointer" onClick={() => navigate('/blog')}>Blog</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li className="hover:text-white cursor-pointer" onClick={() => navigate('/about')}>About Us</li>
                            <li className="hover:text-white cursor-pointer" onClick={() => navigate('/contact')}>Contact</li>
                            <li className="hover:text-white cursor-pointer" onClick={() => navigate('/privacy')}>Privacy</li>
                            <li className="hover:text-white cursor-pointer" onClick={() => navigate('/terms')}>Terms</li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800">
                    <p className="text-center text-gray-400">© 2025 Plant Saathi AI. Remote-first. All pilot data preliminary.</p>
                    <p className="text-center text-sm text-gray-500 mt-2">
                        Contact: <a href="mailto:plantsaathiai@gmail.com" className="text-green-400 hover:underline">plantsaathiai@gmail.com</a> ·
                        Phone: <a href="tel:+917004741371" className="text-green-400 hover:underline">+91 70047 41371</a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
