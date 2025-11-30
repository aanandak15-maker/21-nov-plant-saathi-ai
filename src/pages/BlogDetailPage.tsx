import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, BookmarkPlus, Eye, ChevronRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { blogService, Blog } from '@/lib/contentService';
import { useToast } from '@/hooks/use-toast';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { BlogAudioPlayer } from '@/components/blog/BlogAudioPlayer';
import { SEOHead } from '@/components/shared/SEOHead';

const BlogDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        loadBlog();
        window.scrollTo(0, 0);
    }, [slug]);

    const loadBlog = async () => {
        if (!slug) return;

        try {
            setLoading(true);
            const blogData = await blogService.getBySlug(slug);

            if (!blogData) {
                toast({
                    title: "Blog not found",
                    description: "The blog post you're looking for doesn't exist.",
                    variant: "destructive"
                });
                navigate('/blog');
                return;
            }

            setBlog(blogData);

            // Load related blogs from same category
            if (blogData.category) {
                const related = await blogService.getByCategory(blogData.category, 3);
                setRelatedBlogs(related.filter(b => b.id !== blogData.id));
            }
        } catch (error) {
            console.error('Failed to load blog:', error);
            toast({
                title: "Error loading blog",
                description: "Please try again later",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        if (navigator.share && blog) {
            navigator.share({
                title: blog.title,
                text: blog.excerpt,
                url: window.location.href
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast({
                title: "Link copied!",
                description: "Blog link copied to clipboard"
            });
        }
    };

    const handleWhatsAppShare = () => {
        if (!blog) return;
        const text = encodeURIComponent(`Check out this article on Plant Saathi AI: ${blog.title}\n\n${window.location.href}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-900 selection:bg-green-100 selection:text-green-900">
            <SEOHead
                title={blog.title}
                description={blog.excerpt}
                image={blog.cover_url}
                type="article"
                publishedTime={blog.published_at || blog.created_at}
                author={blog.author_name}
            />

            <ReadingProgress />

            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-xl font-bold text-green-600 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <img src="/logo.jpg" alt="Plant Saathi AI" className="w-8 h-8 rounded-lg" />
                            <span className="hidden sm:inline">Plant Saathi <span className="text-green-700">AI</span></span>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/blog')}
                            className="flex items-center gap-2 text-gray-600 hover:text-green-600"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Back to Blog</span>
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleWhatsAppShare}
                            className="hidden sm:flex items-center gap-2 text-green-700 border-green-200 hover:bg-green-50"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Share on WhatsApp
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleShare}
                            className="text-gray-500 hover:text-green-600 hover:bg-green-50"
                        >
                            <Share2 className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-green-600 hover:bg-green-50"
                        >
                            <BookmarkPlus className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-12 pb-8"
            >
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    {/* Category Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none px-4 py-1.5 text-sm uppercase tracking-wider mb-6">
                            {blog.category}
                        </Badge>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-8 leading-tight tracking-tight"
                    >
                        {blog.title}
                    </motion.h1>

                    {/* Meta Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-serif font-bold">
                                {blog.author_name.charAt(0)}
                            </div>
                            <span className="text-gray-900">{blog.author_name}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(blog.published_at || blog.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{blog.read_time || '5 min read'}</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Cover Image */}
            {blog.cover_url && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-5xl mx-auto px-4 sm:px-6 mb-12"
                >
                    <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src={blog.cover_url}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-4 italic">
                        Image source: Unsplash / Plant Saathi AI
                    </p>
                </motion.div>
            )}

            {/* Content */}
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-3xl mx-auto px-4 sm:px-6 pb-16"
            >
                {/* Audio Player for Farmers */}
                <BlogAudioPlayer text={blog.content} />

                <div className="prose prose-lg prose-green max-w-none
          prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-green-900
          prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
          prose-strong:text-gray-900 prose-strong:font-bold
          prose-ul:my-6 prose-ul:space-y-2
          prose-li:text-gray-700 prose-li:leading-relaxed
          prose-a:text-green-700 prose-a:font-medium hover:prose-a:text-green-800 prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-4 prose-blockquote:border-green-800 prose-blockquote:bg-white prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:shadow-sm prose-blockquote:italic prose-blockquote:text-xl prose-blockquote:text-gray-800
          prose-img:rounded-xl prose-img:shadow-lg
          prose-hr:border-gray-200 prose-hr:my-12"
                    dangerouslySetInnerHTML={{
                        __html: blog.content.replace(/\n/g, '<br/>').replace(/##/g, '<h2>').replace(/<h2>/g, '</p><h2>').replace(/<\/h2>/g, '</h2><p>')
                    }}
                />

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex items-center gap-3 flex-wrap">
                            <Tag className="w-4 h-4 text-gray-400" />
                            {blog.tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer px-3 py-1"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mobile WhatsApp Share (Bottom Fixed) */}
                <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
                    <Button
                        onClick={handleWhatsAppShare}
                        className="w-full bg-green-600 hover:bg-green-700 text-white shadow-xl rounded-full py-6 text-lg font-bold flex items-center justify-center gap-2"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Share on WhatsApp
                    </Button>
                </div>

                {/* Author Bio Box */}
                <div className="mt-16 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-serif text-3xl font-bold shrink-0">
                        {blog.author_name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">About {blog.author_name}</h3>
                        <p className="text-gray-600 mb-4">
                            Expert agricultural consultant with over 10 years of experience in sustainable farming practices and agritech implementation.
                        </p>
                        <Button variant="outline" size="sm" className="text-green-800 border-green-200 hover:bg-green-50">
                            View Profile
                        </Button>
                    </div>
                </div>
            </motion.article>

            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
                <section className="bg-white py-16 border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-serif font-bold text-gray-900">More from {blog.category}</h2>
                            <Button variant="ghost" className="text-green-800 hover:bg-green-50" onClick={() => navigate('/blog')}>
                                View All <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedBlogs.map((relatedBlog) => (
                                <motion.div
                                    key={relatedBlog.id}
                                    whileHover={{ y: -4 }}
                                    className="group cursor-pointer"
                                    onClick={() => navigate(`/blog/${relatedBlog.slug}`)}
                                >
                                    <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 relative">
                                        <img
                                            src={relatedBlog.cover_url || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800'}
                                            alt={relatedBlog.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
                                        <span>{new Date(relatedBlog.published_at || relatedBlog.created_at).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{relatedBlog.read_time || '5 min read'}</span>
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-800 transition-colors">
                                        {relatedBlog.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {relatedBlog.excerpt}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <div className="bg-green-900 text-white py-20 pb-32 sm:pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-4xl font-serif font-bold mb-6">Ready to Transform Your Farm?</h2>
                    <p className="text-green-100 text-xl mb-10 max-w-2xl mx-auto font-light">
                        Join thousands of farmers using Plant Saathi AI to increase yields and reduce costs.
                    </p>
                    <Button
                        onClick={() => navigate('/auth')}
                        className="bg-white text-green-900 hover:bg-green-50 text-lg px-10 py-6 rounded-full font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        Get Started for Free
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;
