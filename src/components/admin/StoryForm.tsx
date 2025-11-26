import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X, Upload, Trophy } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FarmerStory } from '@/lib/contentService';

interface StoryFormProps {
    story?: FarmerStory | null;
    onSave: () => void;
    onCancel: () => void;
}

export const StoryForm = ({ story, onSave, onCancel }: StoryFormProps) => {
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        farmer_name: '',
        location: '',
        achievement: '',
        achievement_hi: '',
        achievement_bn: '',
        image_url: '',
        yield_increase: '',
        crop_type: '',
        status: 'draft' as 'draft' | 'published' | 'archived'
    });

    useEffect(() => {
        if (story) {
            setFormData({
                farmer_name: story.farmer_name,
                location: story.location,
                achievement: story.achievement,
                achievement_hi: story.achievement_hi || '',
                achievement_bn: story.achievement_bn || '',
                image_url: story.image_url || '',
                yield_increase: story.yield_increase?.toString() || '',
                crop_type: story.crop_type || '',
                status: story.status
            });
        }
    }, [story]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.farmer_name || !formData.location || !formData.achievement) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        setSaving(true);
        try {
            const storyData = {
                ...formData,
                yield_increase: formData.yield_increase ? parseFloat(formData.yield_increase) : null
            };

            if (story) {
                const { error } = await supabase
                    .from('farmer_stories')
                    .update(storyData)
                    .eq('id', story.id);

                if (error) throw error;
                toast({ title: "Success", description: "Story updated successfully" });
            } else {
                const { error } = await supabase
                    .from('farmer_stories')
                    .insert(storyData);

                if (error) throw error;
                toast({ title: "Success", description: "Story created successfully" });
            }
            onSave();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save story",
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
                    <Trophy className="w-6 h-6" />
                    {story ? 'Edit Success Story' : 'Add Farmer Success Story'}
                </h2>
                <Button variant="ghost" size="icon" onClick={onCancel}>
                    <X className="w-5 h-5" />
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Farmer Name */}
                <div>
                    <Label htmlFor="farmer_name">Farmer Name *</Label>
                    <Input
                        id="farmer_name"
                        value={formData.farmer_name}
                        onChange={(e) => setFormData({ ...formData, farmer_name: e.target.value })}
                        placeholder="Ramesh Kumar or Pilot Participant"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">Use "Pilot Participant" for anonymized stories</p>
                </div>

                {/* Location */}
                <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Punjab, India"
                        required
                    />
                </div>

                {/* Achievement (English) */}
                <div>
                    <Label htmlFor="achievement">Achievement (English) *</Label>
                    <Textarea
                        id="achievement"
                        value={formData.achievement}
                        onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                        placeholder="Increased rice yield by 40% using satellite monitoring and smart irrigation"
                        rows={3}
                        required
                    />
                </div>

                {/* Achievement (Hindi) */}
                <div>
                    <Label htmlFor="achievement_hi">Achievement (Hindi - हिंदी)</Label>
                    <Textarea
                        id="achievement_hi"
                        value={formData.achievement_hi}
                        onChange={(e) => setFormData({ ...formData, achievement_hi: e.target.value })}
                        placeholder="उपग्रह निगरानी और स्मार्ट सिंचाई का उपयोग करके धान की उपज में 40% की वृद्धि"
                        rows={2}
                    />
                </div>

                {/* Achievement (Bengali) */}
                <div>
                    <Label htmlFor="achievement_bn">Achievement (Bengali - বাংলা)</Label>
                    <Textarea
                        id="achievement_bn"
                        value={formData.achievement_bn}
                        onChange={(e) => setFormData({ ...formData, achievement_bn: e.target.value })}
                        placeholder="স্যাটেলাইট মনিটরিং এবং স্মার্ট সেচ ব্যবহার করে ধানের ফলন 40% বৃদ্ধি"
                        rows={2}
                    />
                </div>

                {/* Image URL */}
                <div>
                    <Label htmlFor="image_url">Farmer/Farm Image URL</Label>
                    <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                    />
                    {formData.image_url && (
                        <div className="mt-2">
                            <img src={formData.image_url} alt="Farmer" className="w-full h-48 object-cover rounded" />
                        </div>
                    )}
                    <p className="text-sm text-gray-500 mt-1">Recommended: Real farm photos or farmer portraits</p>
                </div>

                {/* Crop Type and Yield Increase */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="crop_type">Crop Type</Label>
                        <Select value={formData.crop_type} onValueChange={(value) => setFormData({ ...formData, crop_type: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select crop" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Rice">Rice</SelectItem>
                                <SelectItem value="Wheat">Wheat</SelectItem>
                                <SelectItem value="Corn">Corn</SelectItem>
                                <SelectItem value="Cotton">Cotton</SelectItem>
                                <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                                <SelectItem value="Vegetables">Vegetables</SelectItem>
                                <SelectItem value="Mixed">Mixed Crops</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="yield_increase">Yield Increase (%)</Label>
                        <Input
                            id="yield_increase"
                            type="number"
                            step="0.1"
                            value={formData.yield_increase}
                            onChange={(e) => setFormData({ ...formData, yield_increase: e.target.value })}
                            placeholder="40"
                        />
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
                                {story ? 'Update Story' : 'Create Story'}
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
