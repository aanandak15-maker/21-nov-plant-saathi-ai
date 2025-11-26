import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sprout, Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-green-700 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logo.jpg" alt="Plant Saathi AI" className="w-10 h-10 rounded-lg" />
                        Plant Saathi AI
                    </div>
                    <Button onClick={() => navigate('/')}>Back to Home</Button>
                </div>
            </nav>

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-6">Get in Touch</h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Have questions? We're here to help. Reach out to our team.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <Mail className="w-6 h-6 text-green-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                                        <p className="text-gray-600">plantsaathiai@gmail.com</p>
                                        <p className="text-gray-600">plantsaathiai@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <Phone className="w-6 h-6 text-green-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                                        <p className="text-gray-600">+91 123 456 7890</p>
                                        <p className="text-sm text-gray-500">Mon-Sat, 9 AM - 6 PM IST</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <MapPin className="w-6 h-6 text-green-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Visit Us</h3>
                                        <p className="text-gray-600">
                                            123 AgTech Hub<br />
                                            Bangalore, Karnataka 560001<br />
                                            India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                    <textarea
                                        rows={5}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6">
                                    <Send className="mr-2 w-5 h-5" /> Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
