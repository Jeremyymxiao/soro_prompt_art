import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleVideos = [
  {
    title: 'A cinematic shot of a baby playing with colorful building blocks',
    prompt: 'A cinematic shot of a baby sitting on a soft carpet, playing with colorful wooden building blocks. The scene is warmly lit with natural sunlight streaming through a window. The baby is wearing comfortable, pastel-colored clothing and is fully engaged in stacking and exploring the blocks. The camera angle captures both the concentration on the baby\'s face and the creative play with the blocks.',
    youtubeUrl: 'https://www.youtube.com/watch?v=example1',
    thumbnailUrl: 'https://img.youtube.com/vi/example1/maxresdefault.jpg',
  },
  {
    title: 'A serene lake at sunset with mountains',
    prompt: 'A beautiful, serene lake surrounded by snow-capped mountains at sunset. The water surface perfectly reflects the warm golden light and the mountain silhouettes. A gentle breeze creates small ripples on the water. In the foreground, a few rocks and pine trees frame the scene.',
    youtubeUrl: 'https://www.youtube.com/watch?v=example2',
    thumbnailUrl: 'https://img.youtube.com/vi/example2/maxresdefault.jpg',
  },
];

async function main() {
  console.log('Start seeding...');
  
  for (const video of sampleVideos) {
    const result = await prisma.video.create({
      data: video,
    });
    console.log(`Created video with id: ${result.id}`);
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 