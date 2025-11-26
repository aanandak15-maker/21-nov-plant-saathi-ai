import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X, Upload, Video } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EducationalVideo } from '@/lib/contentService';

interface VideoFormProps {
    video?: EducationalVideo | null;
    onSave: () => void;
    onCancel: () => void;
}

export const VideoForm = ({ video, onSave, onCancel }: VideoFormProps) => {
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        title_hi: '',
        title_bn: '',
        description: '',
        description_hi: '',
        description_bn: '',
        youtube_id: '',
        thumbnail_url: '',
        duration: '',
        category: 'Techniques',
        status: 'draft' as 'draft' | 'published' | 'archived'
    });

    useEffect(() => {
        if (video) {
            setFormData({
                title: video.title,
                title_hi: video.title_hi || '',
                title_bn: video.title_bn || '',
                description: video.description,
                description_hi: video.description_hi || '',
                description_bn: video.description_bn || '',
                youtube_id: video.youtube_id,
                thumbnail_url: video.thumbnail_url || '',
                duration: video.duration || '',
                category: video.category,
                status: video.status
            });
        }
    }, [video]);

    const extractYouTubeId = (url: string) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : url;
    };

    const handleYouTubeUrlChange = (url: string) => {
        const videoId = extractYouTubeId(url);
        setFormData({
            ...formData,
            youtube_id: videoId,
            thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.youtube_id) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        setSaving(true);
        try {
            const videoData = {
                ...formData,
                views: 0
            };

            if (video) {
                const { error } = await supabase
                    .from('educational_videos')
                    .update(videoData)
                    .eq('id', video.id);

                if (error) throw error;
                toast({ title: "Success", description: "Video updated successfully" });
            } else {
                const { error } = await supabase
                    .from('educational_videos')
                    .insert(videoData);

                if (error) throw error;
                toast({ title: "Success", description: "Video added successfully" });
            }
            onSave();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save video",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Video className="w-6 h-6" />
                    {video ? 'Edit Video' : 'Add Educational Video'}
                </h2>
                <Button variant="ghost" size="icon" onClick={onCancel}>
                    <X className="w-5 h-5" />
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* YouTube URL */}
                <div>
                    <Label htmlFor="youtube_url">YouTube URL *</Label>
                    <Input
                        id="youtube_url"
                        defaultValue={`https://youtube.com/watch?v=${formData.youtube_id}`}
                        onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                        placeholder="https://youtube.com/watch?v=... or just the video ID"
                        required
                    />
                    {formData.youtube_id && (
                        <div className="mt-2">
                            <img
                                src={formData.thumbnail_url}
                                alt="Video thumbnail"
                                className="w-full h-48 object-cover rounded"
                            />
                            <p className="text-sm text-gray-500 mt-1">Video ID: {formData.youtube_id}</p>
                        </div>
                    )}
                </div>

                {/* Title (English) */}
                <div>
                    <Label htmlFor="title">Title (English) *</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Modern Farming Techniques"
                        required
                    />
                </div>

                {/* Title (Hindi) */}
                <div>
                    <Label htmlFor="title_hi">Title (Hindi - हिंदी)</Label>
                    <Input
                        id="title_hi"
                        value={formData.title_hi}
                        onChange={(e) => setFormData({ ...formData, title_hi: e.target.value })}
                        placeholder="आधुनिक खेती की तकनीक"
                    />
                </div>

                {/* Title (Bengali) */}
                <div>
                    <Label htmlFor="title_bn">Title (Bengali - বাংলা)</Label>
                    <Input
                        id="title_bn"
                        value={formData.title_bn}
                        onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })}
                        placeholder="আধুনিক কৃষি কৌশল"
                    />
                </div>

                {/* Description (English) */}
                <div>
                    <Label htmlFor="description">Description (English) *</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Learn about modern farming methods and tools"
                        rows={3}
                        required
                    />
                </div>

                {/* Description (Hindi) */}
                <div>
                    <Label htmlFor="description_hi">Description (Hindi - हिंदी)</Label>
                    <Textarea
                        id="description_hi"
                        value={formData.description_hi}
                        onChange={(e) => setFormData({ ...formData, description_hi: e.target.value })}
                        placeholder="आधुनिक खेती के तरीके और उपकरण जानें"
                        rows={2}
                    />
                </div>

                {/* Description (Bengali) */}
                <div>
                    <Label htmlFor="description_bn">Description (Bengali - বাংলা)</Label>
                    <Textarea
                        id="description_bn"
                        value={formData.description_bn}
                        onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })}
                        placeholder="আধুনিক কৃষি পদ্ধতি এবং সরঞ্জাম সম্পর্কে জানুন"
                        rows={2}
                    />
                </div>

                {/* Duration and Category */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                            id="duration"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            placeholder="10:24"
                        />
                    </div>

                    <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Techniques">Farming Techniques</SelectItem>
                                <SelectItem value="Pest Control">Pest Control</SelectItem>
                                <SelectItem value="Irrigation">Irrigation</SelectItem>
                                <SelectItem value="Soil Health">Soil Health</SelectItem>
                                <SelectItem value="Crop Management">Crop Management</SelectItem>
                                <SelectItem value="Equipment">Equipment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Status */}
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
                                {video ? 'Update Video' : 'Add Video'}
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
