import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',  // 优化字体加载
});

export const metadata: Metadata = {
  metadataBase: new URL('https://soraprompt.art'),
  title: {
    default: 'SoraPrompt.Art - Explore OpenAI Sora Video Prompts',
    template: '%s | SoraPrompt.Art'
  },
  description: 'Discover and explore amazing AI-generated videos by OpenAI Sora. Find inspiration, share creativity, and learn from the best prompts in our curated collection.',
  keywords: [
    'Sora', 'OpenAI', 'AI Video', 'Artificial Intelligence', 'Prompts',
    'Text to Video', 'AI Generation', 'Creative Prompts', 'Video Generation',
    'Machine Learning', 'Digital Art', 'AI Technology', 'Video Creation'
  ],
  authors: [{ name: 'SoraPrompt.Art' }],
  creator: 'SoraPrompt.Art',
  publisher: 'SoraPrompt.Art',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://soraprompt.art',
    title: 'SoraPrompt.Art - Explore OpenAI Sora Video Prompts',
    description: 'Discover and explore amazing AI-generated videos by OpenAI Sora. Find inspiration, share creativity, and learn from the best prompts in our curated collection.',
    siteName: 'SoraPrompt.Art',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'SoraPrompt.Art - AI Video Generation Platform'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoraPrompt.Art - Explore OpenAI Sora Video Prompts',
    description: 'Discover and explore amazing AI-generated videos by OpenAI Sora. Find inspiration, share creativity, and learn from the best prompts.',
    images: ['/og-image.jpg'],
    creator: '@soraprompt',
    site: '@soraprompt'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    // other verification codes as needed
  },
  alternates: {
    canonical: 'https://soraprompt.art',
    languages: {
      'en-US': 'https://soraprompt.art/en',
      'zh-CN': 'https://soraprompt.art/zh',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
