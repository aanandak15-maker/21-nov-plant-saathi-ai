import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { blogService, videoService, storyService, galleryService, Blog, EducationalVideo, FarmerStory, GalleryPost } from '@/lib/contentService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogEditorForm } from './BlogEditorForm';
import { VideoForm } from './VideoForm';
import { StoryForm } from './StoryForm';

export const ContentManager = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('blogs');

  // State for each content type
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [videos, setVideos] = useState<EducationalVideo[]>([]);
  const [stories, setStories] = useState<FarmerStory[]>([]);
  const [gallery, setGallery] = useState<GalleryPost[]>([]);

  // Form modal states
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showStoryForm, setShowStoryForm] = useState(false);

  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editingVideo, setEditingVideo] = useState<EducationalVideo | null>(null);
  const [editingStory, setEditingStory] = useState<FarmerStory | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const [blogsData, videosData, storiesData, galleryData] = await Promise.all([
        blogService.getAll(),
        videoService.getAll(),
        storyService.getAll(),
        galleryService.getAll()
      ]);
      setBlogs(blogsData);
      setVideos(videosData);
      setStories(storiesData);
      setGallery(galleryData);
    } catch (error) {
      console.error('Failed to load content:', error);
      toast({
        title: "Error",
        description: "Failed to load content. Make sure Supabase migration is complete.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  const handleAddContent = () => {
    if (activeTab === 'blogs') {
      setEditingBlog(null);
      setShowBlogForm(true);
    } else if (activeTab === 'videos') {
      setEditingVideo(null);
      setShowVideoForm(true);
    } else if (activeTab === 'stories') {
      setEditingStory(null);
      setShowStoryForm(true);
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setShowBlogForm(true);
  };

  const handleEditVideo = (video: EducationalVideo) => {
    setEditingVideo(video);
    setShowVideoForm(true);
  };

  const handleEditStory = (story: FarmerStory) => {
    setEditingStory(story);
    setShowStoryForm(true);
  };

  const handleFormClose = () => {
    setShowBlogForm(false);
    setShowVideoForm(false);
    setShowStoryForm(false);
    setEditingBlog(null);
    setEditingVideo(null);
    setEditingStory(null);
    loadContent();
  };

  // Show forms if active
  if (showBlogForm) {
    return <BlogEditorForm blog={editingBlog} onSave={handleFormClose} onCancel={handleFormClose} />;
  }

  if (showVideoForm) {
    return <VideoForm video={editingVideo} onSave={handleFormClose} onCancel={handleFormClose} />;
  }

  if (showStoryForm) {
    return <StoryForm story={editingStory} onSave={handleFormClose} onCancel={handleFormClose} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management</h2>
        {activeTab !== 'gallery' && (
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddContent}>
            <Plus className="w-4 h-4 mr-2" />
            {activeTab === 'blogs' && 'Add Blog'}
            {activeTab === 'videos' && 'Add Video'}
            {activeTab === 'stories' && 'Add Story'}
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="blogs">Blogs ({blogs.length})</TabsTrigger>
          <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
          <TabsTrigger value="stories">Stories ({stories.length})</TabsTrigger>
          <TabsTrigger value="gallery">Gallery ({gallery.length})</TabsTrigger>
        </TabsList>

        {/* BLOGS TAB */}
        <TabsContent value="blogs" className="space-y-4">
          {blogs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">No blogs yet</p>
              <p className="text-sm text-gray-500">Run the Supabase migration first, or add your first blog!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} onEdit={handleEditBlog} onRefresh={loadContent} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* VIDEOS TAB */}
        <TabsContent value="videos" className="space-y-4">
          {videos.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">No videos yet</p>
              <Button onClick={handleAddContent}>
                <Plus className="w-4 h-4 mr-2" /> Add First Video
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} onEdit={handleEditVideo} onRefresh={loadContent} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* STORIES TAB */}
        <TabsContent value="stories" className="space-y-4">
          {stories.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">No farmer stories yet</p>
              <Button onClick={handleAddContent}>
                <Plus className="w-4 h-4 mr-2" /> Add First Story
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} onEdit={handleEditStory} onRefresh={loadContent} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* GALLERY TAB */}
        <TabsContent value="gallery" className="space-y-4">
          {gallery.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">No gallery posts yet</p>
              <p className="text-sm text-gray-500">Gallery posts appear after users upload farm photos</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {gallery.map((post) => (
                <GalleryCard key={post.id} post={post} onRefresh={loadContent} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Component for individual blog card
const BlogCard = ({ blog, onEdit, onRefresh }: { blog: Blog; onEdit: (blog: Blog) => void; onRefresh: () => void }) => {
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    setDeleting(true);
    try {
      await blogService.delete(blog.id);
      toast({ title: "Success", description: "Blog deleted successfully" });
      onRefresh();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete blog", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
      <div className="flex gap-4">
        {blog.cover_url && (
          <img src={blog.cover_url} alt={blog.title} className="w-24 h-24 object-cover rounded" />
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg">{blog.title}</h3>
              <p className="text-sm text-gray-600">{blog.excerpt}</p>
            </div>
            <div className="flex gap-2">
              {blog.status === 'published' ? (
                <Eye className="w-5 h-5 text-green-600" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{blog.category}</span>
            <span>{blog.views} views</span>
            <span>{new Date(blog.published_at || blog.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}>
              <Eye className="w-4 h-4 mr-1" /> View
            </Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(blog)}>
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for individual video card
const VideoCard = ({ video, onEdit, onRefresh }: { video: EducationalVideo; onEdit: (video: EducationalVideo) => void; onRefresh: () => void }) => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-green-300 transition-colors">
      <img
        src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
        alt={video.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold mb-1">{video.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-gray-500">{video.views} views</span>
          <span className={`px-2 py-1 rounded text-xs ${video.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {video.status}
          </span>
        </div>
        <Button size="sm" variant="outline" onClick={() => onEdit(video)} className="w-full">
          <Edit className="w-4 h-4 mr-1" /> Edit Video
        </Button>
      </div>
    </div>
  );
};

// Component for individual story card
const StoryCard = ({ story, onEdit, onRefresh }: { story: FarmerStory; onEdit: (story: FarmerStory) => void; onRefresh: () => void }) => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-green-300 transition-colors">
      {story.image_url && (
        <img src={story.image_url} alt={story.farmer_name} className="w-full h-40 object-cover" />
      )}
      <div className="p-4">
        <h3 className="font-bold mb-1">{story.farmer_name}</h3>
        <p className="text-sm text-gray-600 mb-2">{story.location}</p>
        <p className="text-sm mb-3">{story.achievement}</p>
        <div className="flex items-center gap-2 text-sm mb-3">
          {story.yield_increase && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
              +{story.yield_increase}% yield
            </span>
          )}
          {story.crop_type && (
            <span className="text-gray-600">{story.crop_type}</span>
          )}
        </div>
        <Button size="sm" variant="outline" onClick={() => onEdit(story)} className="w-full">
          <Edit className="w-4 h-4 mr-1" /> Edit Story
        </Button>
      </div>
    </div>
  );
};

// Component for individual gallery post
const GalleryCard = ({ post, onRefresh }: { post: GalleryPost; onRefresh: () => void }) => {
  const { toast } = useToast();

  const handleApprove = async () => {
    try {
      await galleryService.approve(post.id);
      toast({ title: "Success", description: "Gallery post approved" });
      onRefresh();
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve", variant: "destructive" });
    }
  };

  const handleReject = async () => {
    try {
      await galleryService.reject(post.id);
      toast({ title: "Success", description: "Gallery post rejected" });
      onRefresh();
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject", variant: "destructive" });
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
      <img src={post.image_url} alt={post.caption || 'Gallery'} className="w-full h-48 object-cover" />
      <div className="p-3">
        <p className="text-sm mb-2">{post.caption}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{post.location}</span>
          <span>{post.likes} likes</span>
        </div>
        {post.status === 'pending' && (
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleApprove}>
              <CheckCircle className="w-4 h-4 mr-1" /> Approve
            </Button>
            <Button size="sm" variant="destructive" className="flex-1" onClick={handleReject}>
              <XCircle className="w-4 h-4 mr-1" /> Reject
            </Button>
          </div>
        )}
        {post.status === 'published' && (
          <div className="text-center text-sm text-green-600 font-semibold">✓ Published</div>
        )}
      </div>
    </div>
  );
};
