/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: process.env.NEXT_PUBLIC_DESTINATION + '/:path*' // Proxy to Backend
            }
        ]
    }
}

module.exports = nextConfig
