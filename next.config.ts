/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'www.steakclub-newyork.de',
			},
			{
				protocol: 'https',
				hostname: 'cdn.dribbble.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'www.mercedes-benz.com',
			},
			{
				protocol: 'https',
				hostname: 'www.audi.com',
			},
			{
				protocol: 'https',
				hostname: 'cdn.bmwblog.com',
			},
			{
				protocol: 'https',
				hostname: 'images.hgmsites.net',
			},
		],
	},
};

module.exports = nextConfig;
