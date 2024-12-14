/// <reference types="youtube" />

'use client';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
  }
}

import Image from 'next/image';
import { CopyIcon } from '@radix-ui/react-icons';
import YouTube from 'react-youtube';
import { useState, useEffect } from 'react';

interface VideoCardProps {
  id: string;
  title: string;
  prompt: string;
  youtubeUrl: string;
  thumbnailUrl: string;
}

const getYoutubeThumbnail = (videoId: string) => {
  return [
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,      // 480x360
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,      // 320x180
    `https://i.ytimg.com/vi/${videoId}/default.jpg`,        // 120x90
    'https://placehold.co/640x360/eee/999?text=Video+Unavailable',
  ];
};

const getVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    // 处理标准 YouTube URL
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    }
    // 处理短链接
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
    return null;
  } catch {
    return null;
  }
};

export function VideoCard({ id, title, prompt, youtubeUrl, thumbnailUrl }: VideoCardProps) {
  const videoId = getVideoId(youtubeUrl);
  const [showVideo, setShowVideo] = useState(false);
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState(
    thumbnailUrl || (videoId ? getYoutubeThumbnail(videoId)[0] : '')
  );

  // 加载 YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const onPlayerReady = (event: YT.PlayerEvent) => {
    console.log('Player ready');
    setPlayer(event.target);
    setIsLoading(false);
    if (showVideo) {
      event.target.playVideo();
    }
  };

  const onPlayerError = (event: YT.OnErrorEvent) => {
    console.error('YouTube player error:', event);
    setError('Failed to load video');
    setShowVideo(false);
    setIsLoading(false);
  };

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    // 当视频暂停或结束时
    if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
      setShowVideo(false);
    }
  };

  const handleThumbnailClick = () => {
    if (!videoId) return;
    setIsLoading(true);
    setShowVideo(true);
    setError(null);
    
    if (player) {
      player.playVideo();
      setIsLoading(false);
    }
  };

  const handleImageError = () => {
    const thumbnails = videoId ? getYoutubeThumbnail(videoId) : [];
    const nextIndex = thumbnails.indexOf(currentThumbnailUrl) + 1;
    if (nextIndex < thumbnails.length) {
      setCurrentThumbnailUrl(thumbnails[nextIndex]);
    }
  };

  return (
    <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100">
      <div className="aspect-video relative" role="img" aria-label={`Video thumbnail for ${title}`}>
        {!showVideo ? (
          <div 
            className="relative w-full h-full cursor-pointer group" 
            onClick={handleThumbnailClick}
            role="button"
            aria-label={`Play video: ${title}`}
          >
            <Image
              src={currentThumbnailUrl}
              alt={`Thumbnail for AI-generated video: ${title} - ${prompt.slice(0, 100)}...`}
              width={480}
              height={360}
              priority={true}
              loading="eager"
              className="object-cover w-full h-full transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
              onError={handleImageError}
              unoptimized={true}
              style={{
                maxWidth: '100%',
                height: 'auto',
                aspectRatio: '16/9',
              }}
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm flex items-center justify-center">
              <div className="transform transition-all duration-500 group-hover:scale-110">
                <div className="w-20 h-20 rounded-full bg-white/90 shadow-lg flex items-center justify-center backdrop-blur-md border border-white/50">
                  <span className="sr-only">Play video</span>
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-black/80 border-b-[12px] border-b-transparent ml-2" />
                </div>
              </div>
            </div>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <span className="sr-only">Loading video</span>
                <div className="text-white font-medium tracking-wider">Loading...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full h-full">
            <YouTube
              videoId={videoId || undefined}
              opts={{
                width: '100%',
                height: '360',
                playerVars: {
                  autoplay: 1,
                  modestbranding: 1,
                  controls: 1,
                  rel: 0,
                  showinfo: 0,
                  origin: typeof window !== 'undefined' ? window.location.origin : '',
                },
              }}
              className="w-full"
              iframeClassName="w-full aspect-video"
              onReady={onPlayerReady}
              onError={onPlayerError}
              onStateChange={onPlayerStateChange}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <span className="sr-only">Loading video</span>
                <div className="text-white font-medium tracking-wider">Loading...</div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="text-white font-medium tracking-wider">{error}</div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="p-8">
        <header>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-stone-700 via-neutral-600 to-zinc-700 bg-clip-text text-transparent">
              {title}
            </h2>
            <button 
              onClick={() => navigator.clipboard.writeText(prompt)}
              className="text-neutral-400 hover:text-neutral-600 transition-all duration-300 transform hover:scale-110"
              title="Copy prompt"
              aria-label="Copy video prompt to clipboard"
            >
              <CopyIcon className="w-6 h-6" />
            </button>
          </div>
        </header>
        <p className="text-neutral-600 whitespace-pre-wrap text-base leading-relaxed font-light">
          {prompt}
        </p>
      </div>

      {/* 添加结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": title,
            "description": prompt,
            "thumbnailUrl": currentThumbnailUrl,
            "uploadDate": new Date().toISOString(),
            "embedUrl": `https://www.youtube.com/embed/${videoId}`,
            "contentUrl": youtubeUrl,
            "potentialAction": {
              "@type": "WatchAction",
              "target": youtubeUrl
            },
            "creator": {
              "@type": "Organization",
              "name": "SoraPrompt.Art",
              "url": "https://soraprompt.art"
            }
          })
        }}
      />
    </article>
  );
}