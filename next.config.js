/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      }
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['i.ytimg.com', 'img.youtube.com'],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "img-src 'self' https: data:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://*.ytimg.com",
              "frame-src https://www.youtube.com",
              "style-src 'self' 'unsafe-inline'",
              "connect-src 'self' https://www.youtube.com https://*.ytimg.com"
            ].join('; ')
          },
          {
            key: 'X-Image-Timeout',
            value: '10000', // 10 seconds timeout
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;