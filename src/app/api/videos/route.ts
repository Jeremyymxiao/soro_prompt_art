import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/videos.json');

interface Video {
  id: string;
  title: string;
  prompt: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  thumbnailUrls: string[];
  createdAt: string;
}

const MAX_VIDEOS = 1000; // 限制最大视频数量
const MAX_TITLE_LENGTH = 100;
const MAX_PROMPT_LENGTH = 1000;

// 添加文件锁
let isWriting = false;
const writeQueue: Array<() => Promise<void>> = [];

async function processWriteQueue() {
  if (isWriting || writeQueue.length === 0) return;
  
  isWriting = true;
  try {
    await writeQueue[0]();
  } finally {
    isWriting = false;
    writeQueue.shift();
    if (writeQueue.length > 0) {
      processWriteQueue();
    }
  }
}

async function writeVideosFile(data: { videos: Video[] }) {
  return new Promise<void>((resolve, reject) => {
    const writeOperation = async () => {
      try {
        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), { flag: 'w' });
        resolve();
      } catch (error) {
        console.error('Error writing to file:', error);
        reject(new Error('无法保存数据'));
      }
    };

    writeQueue.push(writeOperation);
    processWriteQueue();
  });
}

async function readVideosFile(): Promise<{ videos: Video[] }> {
  try {
    console.log('Attempting to read file from:', DATA_FILE_PATH);
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading videos file:', error);
    // 如果文件不存在，返回空数组
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('Videos file not found, returning empty array');
      return { videos: [] };
    }
    throw error;
  }
}

function getYouTubeThumbnailUrl(videoId: string): string[] {
  // 使用 img.youtube.com 域名
  return [
    `https://img.youtube.com/vi/${videoId}/default.jpg`,      // 120x90
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,    // 320x180
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,    // 480x360
    `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,    // 640x480
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` // 1920x1080
  ];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, prompt, youtubeUrl } = body;

    // 输入验证
    if (!title?.trim() || !prompt?.trim() || !youtubeUrl?.trim()) {
      return NextResponse.json(
        { error: '缺少必要字段或字段为空' },
        { status: 400 }
      );
    }

    if (title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json(
        { error: `标题长度不能超过 ${MAX_TITLE_LENGTH} 个字符` },
        { status: 400 }
      );
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { error: `提示词长度不能超过 ${MAX_PROMPT_LENGTH} 个字符` },
        { status: 400 }
      );
    }

    // 验证 YouTube URL
    let videoId: string | null = null;
    try {
      const urlObj = new URL(youtubeUrl);
      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v');
      } else if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.slice(1);
      }
    } catch {
      // URL 解析失败
    }

    if (!videoId) {
      return NextResponse.json(
        { error: '无效的 YouTube URL' },
        { status: 400 }
      );
    }

    const data = await readVideosFile();
    
    // 检查视频是否已存在
    if (data.videos.some(v => v.id === videoId)) {
      return NextResponse.json(
        { error: '该视频已存在' },
        { status: 409 }
      );
    }

    // 检查视频数量限制
    if (data.videos.length >= MAX_VIDEOS) {
      return NextResponse.json(
        { error: '视频数量已达到上限' },
        { status: 400 }
      );
    }

    const thumbnailUrls = getYouTubeThumbnailUrl(videoId);
    const newVideo: Video = {
      id: videoId,
      title: title.trim(),
      prompt: prompt.trim(),
      youtubeUrl,
      thumbnailUrl: thumbnailUrls[2],
      thumbnailUrls,
      createdAt: new Date().toISOString(),
    };

    data.videos.unshift(newVideo);
    await writeVideosFile(data);

    return NextResponse.json(newVideo);
  } catch (error) {
    console.error('Failed to create video:', error);
    const message = error instanceof Error ? error.message : '创建视频失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase();
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // 验证分页参数
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: '无效的分页参数' },
        { status: 400 }
      );
    }

    const data = await readVideosFile();
    let videos = data.videos;

    // 搜索过滤
    if (query) {
      videos = videos.filter(video => 
        video.title.toLowerCase().includes(query) ||
        video.prompt.toLowerCase().includes(query)
      );
    }

    // 计算分页
    const total = videos.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const pageVideos = videos.slice(start, end);

    return NextResponse.json({
      videos: pageVideos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    const message = error instanceof Error ? error.message : '获取视频失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}