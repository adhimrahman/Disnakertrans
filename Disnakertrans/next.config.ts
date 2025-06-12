import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'firebasestorage.googleapis.com',
				pathname: '**',
			}
		]
	},
	experimental: {
		serverActions: {
			bodySizeLimit: 10 * 1024 * 1024
		},
	},
};

export default nextConfig;