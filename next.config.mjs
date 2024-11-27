/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com"],
    },
    experimental: {
        vercelToolkit: false, 
    },
};

export default nextConfig;
