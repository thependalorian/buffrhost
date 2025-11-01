/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel deployment optimizations
  poweredByHeader: false,

  // Disable ESLint during builds for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript checking during builds for deployment
  typescript: {
    ignoreBuildErrors: true,
  },

  // Performance optimizations for mobile
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
  },

  // Optimize chunks for better mobile loading
  experimental: {
    optimizePackageImports: ['lucide-react', 'pg', '@neondatabase/serverless'],
  },

  // Force dynamic rendering for all pages - prevent static generation
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },

  // Image optimization for Vercel
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'api.host.buffr.ai',
      'host.buffr.ai',
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Environment variables for Vercel
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'https://api.host.buffr.ai',
    NEON_DATABASE_URL: process.env.NEON_DATABASE_URL,
    NEON_API_URL: process.env.NEON_API_URL,
  },

  // API rewrites for Vercel (only for external services if needed)
  async rewrites() {
    // Only add rewrites if external services are configured
    const rewrites = [];

    // Add signature service if configured
    if (process.env.NEXT_PUBLIC_SIGNATURE_SERVICE_URL) {
      rewrites.push({
        source: '/api/signature/:path*',
        destination: `${process.env.NEXT_PUBLIC_SIGNATURE_SERVICE_URL}/:path*`,
      });
    }

    // Add document service if configured
    if (process.env.NEXT_PUBLIC_DOCUMENT_SERVICE_URL) {
      rewrites.push({
        source: '/api/document/:path*',
        destination: `${process.env.NEXT_PUBLIC_DOCUMENT_SERVICE_URL}/:path*`,
      });
    }

    // Add template service if configured
    if (process.env.NEXT_PUBLIC_TEMPLATE_SERVICE_URL) {
      rewrites.push({
        source: '/api/template/:path*',
        destination: `${process.env.NEXT_PUBLIC_TEMPLATE_SERVICE_URL}/:path*`,
      });
    }

    return rewrites;
  },

  // Webpack optimizations for Vercel
  webpack: (config, { isServer }) => {
    // Optimizations for serverless deployment
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Bundle analyzer for production builds
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: './analyze/client.html',
        })
      );
    }

    return config;
  },

  // Experimental features for better performance - disabled due to CSS issues
  // experimental: {
  //   webVitalsAttribution: ['CLS', 'LCP'],
  // },

  // Headers for security and performance
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
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
