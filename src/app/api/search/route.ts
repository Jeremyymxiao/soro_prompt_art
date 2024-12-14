import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const searchTerm = query.toLowerCase();

  try {
    const videos = await prisma.video.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { prompt: { contains: searchTerm } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: '搜索时发生错误' },
      { status: 500 }
    );
  }
}