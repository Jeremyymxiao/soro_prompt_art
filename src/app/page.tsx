'use client';

import { VideoGrid } from '@/components/ui/video-grid';
import { SearchBar } from '@/components/ui/search-bar';
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface Video {
  id: string;
  title: string;
  prompt: string;
  youtubeUrl: string;
  thumbnailUrl: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse {
  videos: Video[];
  pagination: PaginationInfo;
  error?: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchVideos = useCallback(async (query?: string, page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (query) {
        params.set('q', query);
      }

      const response = await fetch(`/api/videos?${params}`);
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '获取视频失败');
      }

      setVideos(data.videos);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError(error instanceof Error ? error.message : '获取视频失败');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  useEffect(() => {
    fetchVideos(debouncedSearchQuery, 1);
  }, [debouncedSearchQuery, fetchVideos]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (newPage: number) => {
    fetchVideos(searchQuery, newPage);
  };

  return (
    <main className="min-h-screen relative overflow-hidden" role="main" aria-label="Main content">
      {/* 背景装饰元素 */}
      <div aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50/30 via-neutral-50/20 to-zinc-50/30 animate-gradient-slow" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-stone-100/20 via-neutral-100/20 to-zinc-100/20 animate-gradient-x" />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-gray-100/20 via-cool-gray-100/20 to-true-gray-100/20 animate-gradient-y" />
        </div>
        <div className="absolute inset-0 bg-grid-zinc-200/30 bg-[size:40px_40px] [mask-image:radial-gradient(white,transparent_90%)] animate-grid" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-stone-100/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-100/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-neutral-100/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* 主要内容区域 */}
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="text-center mb-16 relative">
          <div className="inline-block">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-stone-700 via-neutral-600 to-zinc-700 bg-clip-text text-transparent mb-6 animate-gradient-text">
              SoraPrompt.Art
            </h1>
            <div className="h-0.5 w-full bg-gradient-to-r from-stone-400 via-neutral-300 to-zinc-400 rounded-full animate-gradient-line opacity-50" />
          </div>
          <p className="text-xl text-neutral-600/80 max-w-2xl mx-auto mt-6 backdrop-blur-sm">
            Explore OpenAI Sora-generated videos and prompts.
          </p>
        </header>

        <nav className="mb-16 relative z-10 backdrop-blur-sm" aria-label="Search">
          <SearchBar onSearch={handleSearch} />
        </nav>
        
        <section aria-label="Video content" className="relative z-10">
          {error ? (
            <div className="text-center text-stone-600 mb-4 bg-stone-50/50 backdrop-blur-sm py-3 px-4 rounded-xl shadow-sm" role="alert">
              {error}
            </div>
          ) : loading ? (
            <div className="text-center text-neutral-600/80 py-3 backdrop-blur-sm" role="status" aria-live="polite">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-neutral-300 border-t-transparent mr-2" aria-hidden="true" />
              <span>Loading...</span>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center text-neutral-600/80 bg-white/20 backdrop-blur-sm py-8 rounded-2xl" role="status" aria-live="polite">
              {searchQuery ? 'No videos found matching your search' : 'No videos available'}
            </div>
          ) : (
            <>
              <VideoGrid videos={videos} />
              {pagination.totalPages > 1 && (
                <nav aria-label="Pagination" className="mt-8 flex justify-center">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded ${
                        page === pagination.page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              )}
            </>
          )}
        </section>
      </div>

      {/* 添加结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SoraPrompt.Art",
            "description": "Explore OpenAI Sora-generated videos and prompts",
            "url": "https://soraprompt.art",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://soraprompt.art/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </main>
  );
}
