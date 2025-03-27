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
            "default-src 'self'; script-src 'none'; sandbox;",
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
};

module.exports = nextConfig;
