import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sprout, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { blogService, Blog } from '@/lib/contentService';
import { useToast } from '@/hooks/use-toast';

const BlogPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [featuredPost, setFeaturedPost] = useState<Blog | null>(null);
    const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ["All", "Farming Tech", "Success Stories", "Market Insights", "Water Management", "Crop Planning", "Technology"];

    // Fallback data when Supabase tables don't exist yet
    const fallbackFeaturedPost: Blog = {
        id: 'fallback-1',
        slug: 'getting-started',
        title: 'Welcome to Plant Saathi AI Blog',
        excerpt: 'Learn about our pilot program and how AI is transforming Indian agriculture.',
        content: 'Blog system initializing...',
        author_name: 'Plant Saathi Team',
        category: 'Technology',
        tags: [],
        views: 0,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const fallbackPosts: Blog[] = [
        {
            id: 'fallback-2',
            slug: 'pilot-program',
            title: 'Join Our University Pilot Program',
            excerpt: 'Be part of our journey to make farming smarter with AI technology.',
            content: '',
            cover_url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800',
            author_name: 'Plant Saathi Team',
            category: 'Success Stories',
            views: 0,
            status: 'published',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];

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

            setFeaturedPost(featured);
            setBlogPosts(all.filter(post => post.id !== featured?.id));
        } catch (error: any) {
            console.error('Failed to load blogs:', error);

            // Check if it's a "table doesn't exist" error
            if (error?.message?.includes('relation') || error?.code === '42P01') {
                toast({
                    title: "Blog system not initialized",
                    description: "Run the Supabase migration first. See SUPABASE_MIGRATION_GUIDE.md",
                    variant: "destructive"
                });
            } else {
                toast({
                    title: "Error loading blogs",
                    description: "Please try again later",
                    variant: "destructive"
                });
            }

            // Use fallback data
            setFeaturedPost(fallbackFeaturedPost);
            setBlogPosts(fallbackPosts);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = selectedCategory === 'All'
        ? blogPosts
        : blogPosts.filter(post => post.category === selectedCategory);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-green-700 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logo.jpg" alt="Plant Saathi AI" className="w-10 h-10 rounded-lg" />
                        Plant Saathi AI
                    </div>
                    <div className="flex gap-4">
                        <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => navigate('/auth')}>
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl font-extrabold mb-4">Plant Saathi Blog</h1>
                        <p className="text-xl text-green-100">Expert insights, farming tips, and real success stories</p>
                    </motion.div>
                </div>
            </section>

            {/* Categories */}
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedCategory === cat
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Story</h2>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid md:grid-cols-2 gap-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl overflow-hidden border-2 border-green-200 cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <img
                                src={featuredPost.cover_url || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1000'}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                    <span className="bg-green-600 text-white px-3 py-1 rounded-full font-semibold">{featuredPost.category}</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(featuredPost.published_at || featuredPost.created_at).toLocaleDateString()}
                                    </span>
                                    <span>{featuredPost.read_time}</span>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">{featuredPost.title}</h3>
                                <p className="text-gray-700 mb-6 text-lg">{featuredPost.excerpt}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>{featuredPost.views} views</span>
                                    <span>By {featuredPost.author_name}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Blog Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        {selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}
                    </h2>

                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">No articles found in this category.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {filteredPosts.map((post, i) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-green-300 hover:shadow-xl transition-all cursor-pointer"
                                >
                                    <img
                                        src={post.cover_url || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800'}
                                        alt={post.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{post.category}</span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(post.published_at || post.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">{post.read_time || '5 min read'}</span>
                                            <span className="text-green-600 font-semibold hover:underline">Read more →</span>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-400">
                                            {post.views} views · By {post.author_name}
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
                <div className="max-w-3xl mx-auto px-6 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Get Weekly Farming Tips</h2>
                    <p className="text-green-100 mb-6">Join our pilot program and receive expert advice, market insights, and success stories every week.</p>
                    <div className="flex gap-2 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                        />
                        <Button className="bg-white text-green-700 hover:bg-gray-100">Subscribe</Button>
                    </div>
                    <p className="text-sm text-green-200 mt-4">Contact: plantsaathiai@gmail.com</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
                    <p>© 2025 Plant Saathi AI. All rights reserved.</p>
                    <p className="text-sm mt-2">
                        Email: <a href="mailto:plantsaathiai@gmail.com" className="text-green-400 hover:underline">plantsaathiai@gmail.com</a> ·
                        Phone: <a href="tel:+917004741371" className="text-green-400 hover:underline">+91 70047 41371</a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default BlogPage;
