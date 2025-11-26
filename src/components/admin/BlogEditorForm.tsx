import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { blogService, Blog } from '@/lib/contentService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BlogEditorFormProps {
    blog?: Blog | null;
    onSave: () => void;
    onCancel: () => void;
}

export const BlogEditorForm = ({ blog, onSave, onCancel }: BlogEditorFormProps) => {
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        cover_url: '',
        category: 'Technology',
        tags: '',
        read_time: '5 min read',
        status: 'draft' as 'draft' | 'published' | 'archived'
    });

    useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title,
                slug: blog.slug,
                excerpt: blog.excerpt,
                content: blog.content,
                cover_url: blog.cover_url || '',
                category: blog.category,
                tags: blog.tags?.join(', ') || '',
                read_time: blog.read_time || '5 min read',
                status: blog.status
            });
        }
    }, [blog]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.slug || !formData.excerpt || !formData.content) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        setSaving(true);
        try {
            const blogData = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                author_name: 'Plant Saathi Team',
                published_at: formData.status === 'published' ? new Date().toISOString() : null
            };

            if (blog) {
                await blogService.update(blog.id, blogData);
                toast({ title: "Success", description: "Blog updated successfully" });
            } else {
                await blogService.create(blogData);
                toast({ title: "Success", description: "Blog created successfully" });
            }
            onSave();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save blog",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        setFormData({ ...formData, slug });
    };

    return (
        <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{blog ? 'Edit Blog' : 'Create New Blog'}</h2>
                <Button variant="ghost" size="icon" onClick={onCancel}>
                    <X className="w-5 h-5" />
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter blog title"
                        required
                    />
                </div>

                {/* Slug */}
                <div>
                    <Label htmlFor="slug">URL Slug *</Label>
                    <div className="flex gap-2">
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="blog-url-slug"
                            required
                        />
                        <Button type="button" variant="outline" onClick={generateSlug}>
                            Auto-generate
                        </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">URL: /blog/{formData.slug}</p>
                </div>

                {/* Excerpt */}
                <div>
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Short description (appears in blog list)"
                        rows={2}
                        required
                    />
                </div>

                {/* Content */}
                <div>
                    <Label htmlFor="content">Content (Markdown) *</Label>
                    <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Write your blog content here (supports Markdown)&#10;&#10;# Heading 1&#10;## Heading 2&#10;**Bold text**&#10;*Italic text*&#10;- Bullet point"
                        rows={15}
                        className="font-mono text-sm"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">Supports Markdown formatting</p>
                </div>

                {/* Cover Image */}
                <div>
                    <Label htmlFor="cover_url">Cover Image URL</Label>
                    <Input
                        id="cover_url"
                        value={formData.cover_url}
                        onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                    />
                    {formData.cover_url && (
                        <div className="mt-2">
                            <img src={formData.cover_url} alt="Cover preview" className="w-full h-48 object-cover rounded" />
                        </div>
                    )}
                    <p className="text-sm text-gray-500 mt-1">Recommended: 1200x630px image</p>
                </div>

                {/* Category and Tags */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Technology">Technology</SelectItem>
                                <SelectItem value="Farming Tech">Farming Tech</SelectItem>
                                <SelectItem value="Success Stories">Success Stories</SelectItem>
                                <SelectItem value="Market Insights">Market Insights</SelectItem>
                                <SelectItem value="Water Management">Water Management</SelectItem>
                                <SelectItem value="Crop Planning">Crop Planning</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="AI, Disease Detection, NDVI"
                        />
                    </div>
                </div>

                {/* Read Time and Status */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="read_time">Read Time</Label>
                        <Input
                            id="read_time"
                            value={formData.read_time}
                            onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                            placeholder="5 min read"
                        />
                    </div>

                    <div>
                        <Label htmlFor="status">Status *</Label>
                        <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                {blog ? 'Update Blog' : 'Create Blog'}
                            </>
                        )}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};
