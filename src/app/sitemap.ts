import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 获取所有视频数据
  const videos = await prisma.video.findMany()

  // 基础URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://soraprompt.art'

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
  const videoRoutes = videos.map((video) => ({
    url: `${baseUrl}/video/${video.id}`,
    lastModified: video.createdAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...routes, ...videoRoutes]
}
