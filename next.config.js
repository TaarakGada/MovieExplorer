/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
                pathname: '/t/p/**',
            },
        ],
        // Adding domains for better handling of TMDB images
        domains: ['image.tmdb.org'],
        // Adding this to handle the case where src might be null
        unoptimized: false,
        // Minimize image-related errors
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy:
            "default-src 'self'; img-src 'self' https://image.tmdb.org data:;",
    },
    // Add this to help debug image-related errors
    onDemandEntries: {
        // Keep pages in memory for longer to prevent reload issues
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 5,
    },
    experimental: {
        // Better error messages for image paths
    },
    reactStrictMode: true,
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; connect-src 'self' https://api.themoviedb.org wss: ws:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://image.tmdb.org data:;",
                    },
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
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
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    eslint: {
        // Similarly, you can also disable eslint checking during builds
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
