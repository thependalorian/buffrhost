/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'theshandi.com', 'cdn.theshandi.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1',
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1';
    // Ensure apiUrl is properly formatted
    if (!apiUrl || apiUrl === 'undefined') {
      return [];
    }
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Output configuration for Vercel
  // output: 'standalone', // Commented out for Vercel compatibility
  // Enable SWC minification
  swcMinify: true,
};

module.exports = nextConfig;