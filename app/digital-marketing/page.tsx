// app/services/digital-marketing/page.tsx
'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Bangers } from 'next/font/google';
import {
	TrendingUp,
	Users,
	Target,
	Search,
	Share2,
	Mail,
	BarChart,
	Instagram,
	Youtube,
	Twitter,
} from 'lucide-react';

const bangers = Bangers({
	weight: '400',
	subsets: ['latin'],
});

export default function DigitalMarketingPage() {
	const cardRef = useRef<HTMLDivElement>(null);
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
	const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });
	const rotateX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
	const rotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		mouseX.set(x);
		mouseY.set(y);
	};

	const marketingServices = [
		{
			icon: <Search className="w-6 h-6" />,
			title: 'SEO Optimization',
			description:
				'Boost your visibility in search engines and drive organic traffic.',
		},
		{
			icon: <Share2 className="w-6 h-6" />,
			title: 'Social Media Marketing',
			description: 'Engage your audience across all major social platforms.',
		},
		{
			icon: <Target className="w-6 h-6" />,
			title: 'PPC Advertising',
			description: 'Targeted ad campaigns that deliver measurable ROI.',
		},
		{
			icon: <Mail className="w-6 h-6" />,
			title: 'Email Marketing',
			description: 'Nurture leads and build customer relationships.',
		},
		{
			icon: <BarChart className="w-6 h-6" />,
			title: 'Analytics & Reporting',
			description: 'Data-driven insights to optimize your marketing strategy.',
		},
		{
			icon: <Users className="w-6 h-6" />,
			title: 'Influencer Marketing',
			description: 'Leverage influencer partnerships to reach new audiences.',
		},
	];

	return (
		<div className="min-h-screen bg-white">
			{/* Distorted Grid Background */}
			<div className="fixed inset-0 z-0 overflow-hidden">
				<svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800">
					<defs>
						<filter id="gridWarp">
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.015"
								numOctaves="2"
								result="noise"
								seed="1"
							>
								<animate
									attributeName="seed"
									from="1"
									to="20"
									dur="8s"
									repeatCount="indefinite"
								/>
							</feTurbulence>
							<feDisplacementMap
								in="SourceGraphic"
								in2="noise"
								scale="20"
								xChannelSelector="R"
								yChannelSelector="G"
							/>
						</filter>
					</defs>
					<motion.g filter="url(#gridWarp)">
						{Array.from({ length: 30 }).map((_, i) => (
							<line
								key={`v-${i}`}
								x1={i * 40}
								y1={0}
								x2={i * 40}
								y2={800}
								stroke="rgba(0, 0, 0, 0.1)"
								strokeWidth="1"
							/>
						))}
						{Array.from({ length: 20 }).map((_, i) => (
							<line
								key={`h-${i}`}
								x1={0}
								y1={i * 40}
								x2={1200}
								y2={i * 40}
								stroke="rgba(0, 0, 0, 0.1)"
								strokeWidth="1"
							/>
						))}
					</motion.g>
				</svg>
			</div>

			{/* Hero Section */}
			<section
				className="relative z-10 pt-32 pb-20 px-4"
				onMouseMove={handleMouseMove}
				onMouseLeave={() => {
					mouseX.set(0);
					mouseY.set(0);
				}}
			>
				<div className="container mx-auto max-w-6xl">
					<motion.div
						ref={cardRef}
						style={{ rotateX, rotateY, transformPerspective: 1000 }}
						className="relative max-w-4xl mx-auto"
					>
						<div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-gray-200/50">
							<motion.div className="absolute -top-4 -right-4 w-20 h-20 bg-linear-to-br from-green-500 to-emerald-500 rounded-2xl shadow-xl z-20 floating-element" />
							<motion.div className="absolute -bottom-4 -left-4 w-24 h-24 bg-linear-to-tr from-blue-500 to-cyan-500 rounded-2xl shadow-xl z-20 floating-element" />

							<div className="text-center">
								<h1
									className={`${bangers.className} text-6xl md:text-7xl mb-6 tracking-wider transform skew-x-[-5deg]`}
								>
									<span className="bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
										Digital
									</span>
									<br />
									<span className="bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
										Marketing
									</span>
								</h1>

								<motion.p
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
									className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
								>
									Grow your business with data-driven marketing strategies that
									deliver real results.
								</motion.p>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 }}
									className="flex gap-4 justify-center"
								>
									<button
										onClick={() => {
											const message = encodeURIComponent(
												"Hi! I'm interested in learning more about boosting my traffic.",
											);
											const whatsappNumber = '2348145983735';
											window.open(
												`https://wa.me/${whatsappNumber}?text=${message}`,
												'_blank',
											);
										}}
										className="px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
									>
										Boost Your Traffic
									</button>
								</motion.div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Services Grid */}
			<section className="relative z-10 py-20 px-4">
				<div className="container mx-auto max-w-6xl">
					<h2 className="text-4xl font-bold text-center mb-12">
						Marketing Solutions
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{marketingServices.map((service, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-all group"
							>
								<div className="w-12 h-12 bg-linear-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
									{service.icon}
								</div>
								<h3 className="text-xl font-bold mb-2">{service.title}</h3>
								<p className="text-gray-600">{service.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Social Media Platforms */}
			<section className="relative z-10 py-20 px-4 bg-linear-to-br from-green-50 to-emerald-50">
				<div className="container mx-auto max-w-6xl text-center">
					<h2 className="text-4xl font-bold mb-4">
						We Dominate Every Platform
					</h2>
					<p className="text-gray-600 mb-12">
						Your brand, everywhere your customers are
					</p>

					<div className="flex flex-wrap justify-center gap-8">
						{[
							{ icon: <Instagram className="w-12 h-12" />, name: 'Instagram' },
							{ icon: <Twitter className="w-12 h-12" />, name: 'Twitter/X' },
							{ icon: <Youtube className="w-12 h-12" />, name: 'YouTube' },
							{ icon: <Share2 className="w-12 h-12" />, name: 'TikTok' },
						].map((platform, index) => (
							<motion.div
								key={index}
								whileHover={{ scale: 1.1, y: -5 }}
								className="bg-white p-6 rounded-2xl shadow-lg"
							>
								<div className="text-green-600 mb-2">{platform.icon}</div>
								<p className="font-semibold">{platform.name}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
