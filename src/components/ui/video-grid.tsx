import Masonry from 'react-masonry-css';
import { VideoCard } from './video-card';
import { useState } from 'react';

interface Video {
  id: string;
  title: string;
  prompt: string;
  youtubeUrl: string;
  thumbnailUrl: string;
}

interface VideoGridProps {
  videos: Video[];
}

export function VideoGrid({ videos }: VideoGridProps) {
  const breakpointColumns = {
    default: 3,
    1536: 3,
    1280: 2,
    1024: 2,
    768: 1,
    640: 1
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto -ml-6"
        columnClassName="pl-6 bg-clip-padding"
      >
        {videos.map((video) => (
          <div key={video.id} className="mb-6">
            <VideoCard {...video} />
          </div>
        ))}
      </Masonry>
    </div>
  );
}