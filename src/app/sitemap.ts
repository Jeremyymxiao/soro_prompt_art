import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 获取所有视频数据
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`)
  const data = await response.json()
  const videos = data.videos || []

  // 基础URL
  const baseUrl = 'https://soraprompt.art'

  // 基础路由
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ] as MetadataRoute.Sitemap

  // 视频页面路由
  const videoRoutes = videos.map((video: any) => ({
    url: `${baseUrl}/video/${video.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  })) as MetadataRoute.Sitemap

  return [...routes, ...videoRoutes]
}
