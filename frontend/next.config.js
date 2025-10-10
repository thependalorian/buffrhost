/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'your-project.supabase.co', 'images.unsplash.com'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  async rewrites() {
    const signatureServiceUrl = process.env.NEXT_PUBLIC_SIGNATURE_SERVICE_URL || 'http://localhost:8001';
    const documentServiceUrl = process.env.NEXT_PUBLIC_DOCUMENT_SERVICE_URL || 'http://localhost:8002';
    const templateServiceUrl = process.env.NEXT_PUBLIC_TEMPLATE_SERVICE_URL || 'http://localhost:8003';
    
    return [
      {
        source: '/api/signature/:path*',
        destination: `${signatureServiceUrl}/:path*`,
      },
      {
        source: '/api/document/:path*',
        destination: `${documentServiceUrl}/:path*`,
      },
      {
        source: '/api/template/:path*',
        destination: `${templateServiceUrl}/:path*`,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;