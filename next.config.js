/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/:path*',
                // destination: 'http://localhost:3001/:path*' // Proxy to Backend
                destination: 'https://howdy-server.up.railway.app/:path*' // Proxy to Backend
            }
        ]
    }
}

module.exports = nextConfig
