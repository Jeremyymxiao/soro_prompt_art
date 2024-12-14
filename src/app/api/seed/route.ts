import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const sampleVideos = [
  {
    title: 'A stylish woman walks down a Tokyo street',
    prompt: 'A stylish woman walks down a Tokyo street filled with warm glowing neon signs, cinematic medium shot, shallow depth of field, shot on 35mm film.',
    youtubeUrl: 'https://www.youtube.com/watch?v=HK6y8DXBW04',
    thumbnailUrl: 'https://i.ytimg.com/vi/HK6y8DXBW04/maxresdefault.jpg',
  },
  {
    title: 'Beautiful octopus swimming in the deep ocean',
    prompt: 'Beautiful octopus swimming in the deep ocean, bioluminescent, ethereal lighting, shot with IMAX cameras.',
    youtubeUrl: 'https://www.youtube.com/watch?v=YQ1vN_91KO0',
    thumbnailUrl: 'https://i.ytimg.com/vi/YQ1vN_91KO0/maxresdefault.jpg',
  },
  {
    title: 'A corgi rides a bicycle',
    prompt: 'A corgi rides a bicycle through San Francisco, wearing a small helmet, joyful expression, cinematic drone shot following the dog.',
    youtubeUrl: 'https://www.youtube.com/watch?v=6ZxHqKgZyVE',
    thumbnailUrl: 'https://i.ytimg.com/vi/6ZxHqKgZyVE/maxresdefault.jpg',
  },
  {
    title: 'Ancient Roman city comes to life',
    prompt: 'Camera flies through a photorealistic ancient Roman city, showing daily life, markets, and architecture, golden hour lighting, highly detailed.',
    youtubeUrl: 'https://www.youtube.com/watch?v=hQqC_FLp2C8',
    thumbnailUrl: 'https://i.ytimg.com/vi/hQqC_FLp2C8/maxresdefault.jpg',
  },
  {
    title: 'Origami bird transforms into real bird',
    prompt: 'A paper origami bird sitting on a wooden table magically transforms into a real bird and flies away, soft natural lighting through window.',
    youtubeUrl: 'https://www.youtube.com/watch?v=qHMqGxXi1fA',
    thumbnailUrl: 'https://i.ytimg.com/vi/qHMqGxXi1fA/maxresdefault.jpg',
  }
];

export async function GET() {
  try {
    // 清除现有数据
    await prisma.video.deleteMany();

    // 添加示例数据
    for (const video of sampleVideos) {
      await prisma.video.create({
        data: video,
      });
    }

    return NextResponse.json({ message: '示例数据添加成功' });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json(
      { error: '添加示例数据失败' },
      { status: 500 }
    );
  }
} 