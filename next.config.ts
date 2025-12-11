import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize production builds
  swcMinify: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  turbopack: {},
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure pdfjs-dist is only bundled for client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
      };
    }
    
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk for large libraries
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Separate chunk for PDF libraries (heavy)
          pdf: {
            name: 'pdf',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](pdfjs-dist|react-pdf)[\\/]/,
            priority: 30,
          },
          // Separate chunk for AI libraries (server-side only, but just in case)
          ai: {
            name: 'ai',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](@google[\\/]generative-ai)[\\/]/,
            priority: 25,
          },
        },
      },
    };
    
    return config;
  },
};

export default nextConfig;
