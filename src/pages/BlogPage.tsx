import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Loader2, Search, TrendingUp, Clock } from 'lucide-react';
import { blogService, Blog } from '@/lib/contentService';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const BlogPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [featuredPost, setFeaturedPost] = useState<Blog | null>(null);
    const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ["All", "Farming Tech", "Success Stories", "Market Insights", "Water Management", "Crop Planning", "Technology"];

    // Fallback data
    const fallbackFeaturedPost: Blog = {
        id: 'fallback-1',
        slug: 'getting-started',
        title: 'The Future of Indian Agriculture: AI & Sustainability',
        excerpt: 'How artificial intelligence is revolutionizing farming practices across India, from precision irrigation to market price prediction.',
        content: 'Blog system initializing...',
        author_name: 'Dr. Vikram Desai',
        category: 'Technology',
        tags: ['AI', 'Future Tech'],
        views: 1250,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        read_time: '8 min read'
    };

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            setLoading(true);
            const [featured, all] = await Promise.all([
                blogService.getFeatured(),
                blogService.getAll()
            ]);

            setFeaturedPost(featured || fallbackFeaturedPost);
            setBlogPosts(all.filter(post => post.id !== featured?.id));
        } catch (error: any) {
            console.error('Failed to load blogs:', error);
            setFeaturedPost(fallbackFeaturedPost);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-800" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-gray-900 font-sans selection:bg-green-100 selection:text-green-900">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-green-600 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <img src="/logo.jpg" alt="Plant Saathi AI" className="w-10 h-10 rounded-lg" />
                            <span>Plant Saathi <span className="text-green-700">AI</span></span>
                        </div>
                        <div className="hidden md:flex items-center gap-1 ml-4">
                            <Button variant="ghost" onClick={() => navigate('/')} className="text-gray-600 hover:text-green-600">
                                Home
                            </Button>
                            <Button variant="ghost" onClick={() => navigate('/blog')} className="text-green-600 font-medium">
                                Blog
                            </Button>
                            <Button variant="ghost" onClick={() => navigate('/about')} className="text-gray-600 hover:text-green-600">
                                About
                            </Button>
                        </div>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => navigate('/auth')}>
                        Get Started
                    </Button>
                </div>
            </nav>

            {/* Immersive Hero Section */}
            <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000"
                        alt="Agriculture Field"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Badge className="bg-green-600/90 hover:bg-green-600 text-white mb-6 px-4 py-1.5 text-sm uppercase tracking-wider">
                            Editorial
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight tracking-tight">
                            Cultivating the Future
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
                            Expert insights, sustainable practices, and the technology shaping modern agriculture.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Search & Filter Bar */}
            <div className="sticky top-[73px] z-40 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-gray-200 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar w-full md:w-auto">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${selectedCategory === cat
                                    ? 'bg-green-900 text-white shadow-md transform scale-105'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-green-800 hover:text-green-800'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search articles..."
                            className="pl-10 bg-white border-gray-200 focus:border-green-800 focus:ring-green-800/20 rounded-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Featured Story - Bento Grid Item 1 */}
                {featuredPost && selectedCategory === 'All' && !searchQuery && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16 group cursor-pointer"
                        onClick={() => navigate(`/blog/${featuredPost.slug}`)}
                    >
                        <div className="grid md:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-2 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500">
                            <div className="md:col-span-7 h-[400px] md:h-[500px] overflow-hidden rounded-2xl relative">
                                <img
                                    src={featuredPost.cover_url || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1000'}
                                    alt={featuredPost.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-white/90 text-green-900 hover:bg-white shadow-sm backdrop-blur-sm">
                                        Featured Story
                                    </Badge>
                                </div>
                            </div>
                            <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-3 text-sm text-green-800 font-medium mb-4 uppercase tracking-wide">
                                    <TrendingUp className="w-4 h-4" />
                                    {featuredPost.category}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight group-hover:text-green-900 transition-colors">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-gray-600 text-lg mb-8 leading-relaxed line-clamp-3">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-serif font-bold">
                                            {featuredPost.author_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{featuredPost.author_name}</p>
                                            <p className="text-xs text-gray-500">{new Date(featuredPost.published_at || featuredPost.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        {featuredPost.read_time || '5 min read'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Main Content Grid - Masonry/Bento Style */}
                <div className="grid md:grid-cols-3 gap-8">
                    {filteredPosts.map((post, i) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => navigate(`/blog/${post.slug}`)}
                            className={`group cursor-pointer flex flex-col ${i % 4 === 0 || i % 4 === 3 ? 'md:col-span-2' : 'md:col-span-1'}`}
                        >
                            <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[16/10] shadow-sm">
                                <img
                                    src={post.cover_url || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800'}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-white/90 text-gray-900 hover:bg-white shadow-sm backdrop-blur-sm">
                                        {post.category}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
                                    <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{post.read_time || '5 min read'}</span>
                                </div>
                                <h3 className={`font-serif font-bold text-gray-900 mb-3 group-hover:text-green-800 transition-colors leading-tight ${i % 4 === 0 || i % 4 === 3 ? 'text-2xl md:text-3xl' : 'text-xl'
                                    }`}>
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 line-clamp-2 mb-4 leading-relaxed flex-grow">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center gap-2 text-green-800 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                    Read Article <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">No articles found</h3>
                        <p className="text-gray-500">Try adjusting your search or category filter.</p>
                        <Button
                            variant="outline"
                            className="mt-6"
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>

            {/* Newsletter Section */}
            <section className="bg-green-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img src="https://www.transparenttextures.com/patterns/cubes.png" alt="pattern" />
                </div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl font-serif font-bold mb-6">Join Our Community</h2>
                    <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
                        Get weekly insights on sustainable farming, market trends, and agritech innovations delivered straight to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            className="bg-white/10 border-white/20 text-white placeholder:text-green-200/70 h-12 rounded-full px-6 focus:ring-white/30"
                        />
                        <Button className="bg-white text-green-900 hover:bg-green-50 h-12 rounded-full px-8 font-bold">
                            Subscribe
                        </Button>
                    </div>
                    <p className="text-xs text-green-300 mt-6">
                        No spam, ever. Unsubscribe at any time.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#1a1a1a] text-white py-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded opacity-80" />
                        <span className="font-serif font-bold text-lg text-gray-300">Plant Saathi AI</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        © 2025 Plant Saathi AI. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default BlogPage;
