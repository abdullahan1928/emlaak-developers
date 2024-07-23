/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'emlaakdevelopers.s3.ap-south-1.amazonaws.com',
                port: '',
                pathname: '/**',
            },
        ],
    }
};

export default nextConfig;
