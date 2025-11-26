import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Play, Clock, Loader2 } from "lucide-react";
import { videoService, EducationalVideo } from "@/lib/contentService";

export const EducationalVideos = () => {
  const { t, i18n } = useTranslation();
  const [videos, setVideos] = useState<EducationalVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<EducationalVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await videoService.getAll(6); // Load top 6
      setVideos(data);
    } catch (error) {
      console.error("Failed to load videos:", error);
      // Fallback to sample videos if Supabase fails
      setVideos(sampleVideos);
    } finally {
      setLoading(false);
    }
  };

  // Sample videos for fallback
  const sampleVideos: EducationalVideo[] = [
    {
      id: '1',
      title: 'Modern Farming Techniques',
      title_hi: 'आधुनिक खेती की तकनीक',
      title_bn: 'আধুনিক কৃষি কৌশল',
      description: 'Learn about modern farming methods and tools',
      description_hi: 'आधुनिक खेती के तरीके और उपकरण जानें',
      description_bn: 'আধুনিক কৃষি পদ্ধতি এবং সরঞ্জাম সম্পর্কে জানুন',
      youtube_id: 'dQw4w9WgXcQ',
      duration: '10:24',
      category: 'Techniques',
      views: 15420,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Organic Pesticide Guide',
      title_hi: 'जैविक कीटनाशक गाइड',
      title_bn: 'জৈব কীটনাশক গাইড',
      description: 'How to make and use organic pesticides',
      description_hi: 'जैविक कीटनाशक कैसे बनाएं और उपयोग करें',
      description_bn: 'জৈব কীটনাশক তৈরি এবং ব্যবহার করুন',
      youtube_id: 'dQw4w9WgXcQ',
      duration: '8:15',
      category: 'Pest Control',
      views: 8320,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Water Conservation Tips',
      title_hi: 'जल संरक्षण युक्तियाँ',
      title_bn: 'জল সংরক্ষণ টিপস',
      description: 'Save water with smart irrigation',
      description_hi: 'स्मार्ट सिंचाई से पानी बचाएं',
      description_bn: 'স্মার্ট সেচ দিয়ে জল সংরক্ষণ করুন',
      youtube_id: 'dQw4w9WgXcQ',
      duration: '12:30',
      category: 'Irrigation',
      views: 12100,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const getLocalizedTitle = (video: EducationalVideo) => {
    if (i18n.language === 'hi') return video.title_hi || video.title;
    if (i18n.language === 'bn') return video.title_bn || video.title;
    return video.title;
  };

  const getLocalizedDescription = (video: EducationalVideo) => {
    if (i18n.language === 'hi') return video.description_hi || video.description;
    if (i18n.language === 'bn') return video.description_bn || video.description;
    return video.description;
  };

  const getThumbnail = (video: EducationalVideo) => {
    return video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`;
  };

  const handleVideoClick = async (video: EducationalVideo) => {
    setSelectedVideo(video);
    // Increment views
    try {
      await videoService.incrementViews(video.id);
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  };

  if (loading) {
    return (
      <div className="mb-6 flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold text-gray-900 mb-3 px-1 flex items-center gap-2">
        📺 Learn Something New
      </h2>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="w-full max-w-4xl bg-background rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.youtube_id}?autoplay=1`}
                title={getLocalizedTitle(selectedVideo)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{getLocalizedTitle(selectedVideo)}</h3>
              <p className="text-sm text-muted-foreground">{getLocalizedDescription(selectedVideo)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Scroll Videos */}
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex-shrink-0 w-[280px] bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-all group snap-start"
            onClick={() => handleVideoClick(video)}
          >
            <div className="relative h-[120px] bg-muted">
              <img
                src={getThumbnail(video)}
                alt={getLocalizedTitle(video)}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to default thumbnail
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                  <Play className="h-6 w-6 text-white ml-1" fill="white" />
                </div>
              </div>
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                {getLocalizedTitle(video)}
              </h3>
              {video.views && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{video.views.toLocaleString()} views</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
