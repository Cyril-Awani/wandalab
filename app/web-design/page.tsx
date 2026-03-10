// app/services/web-design/page.tsx
'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Bangers } from 'next/font/google';
import {
	Palette,
	Layout,
	Eye,
	PenTool,
	Sparkles,
	UserCheck,
	Figma,
	Layers,
} from 'lucide-react';

const bangers = Bangers({
	weight: '400',
	subsets: ['latin'],
});

export default function WebDesignPage() {
	const containerRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);

	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
	const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

	const rotateX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
	const rotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);

	// Add floating animation
	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.to('.floating-element', {
				y: 'random(-20, 20)',
				x: 'random(-20, 20)',
				duration: 'random(3, 6)',
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
			});
		});

		return () => ctx.revert();
	}, []);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		mouseX.set(x);
		mouseY.set(y);
	};

	// Add the missing handleMouseLeave function
	const handleMouseLeave = () => {
		mouseX.set(0);
		mouseY.set(0);
	};

	const designServices = [
		{
			icon: <Palette className="w-6 h-6" />,
			title: 'UI/UX Design',
			description:
				'Intuitive user interfaces and seamless user experiences that keep visitors engaged.',
		},
		{
			icon: <Layout className="w-6 h-6" />,
			title: 'Responsive Design',
			description:
				'Beautiful designs that adapt perfectly to all screen sizes and devices.',
		},
		{
			icon: <Eye className="w-6 h-6" />,
			title: 'Visual Identity',
			description:
				'Unique brand aesthetics that make your business stand out from the competition.',
		},
		{
			icon: <PenTool className="w-6 h-6" />,
			title: 'Wireframing',
			description:
				'Strategic layout planning to optimize user flow and conversion rates.',
		},
		{
			icon: <Sparkles className="w-6 h-6" />,
			title: 'Interactive Elements',
			description:
				'Engaging animations and micro-interactions that delight users.',
		},
		{
			icon: <UserCheck className="w-6 h-6" />,
			title: 'User Research',
			description:
				'Data-driven design decisions based on user behavior and feedback.',
		},
	];

	const designTools = [
		'Figma',
		'Adobe XD',
		'Sketch',
		'Photoshop',
		'Illustrator',
		'After Effects',
		'Framer',
		'InVision',
	];

	return (
		<div className="min-h-screen bg-white">
			{/* Distorted Grid Background */}
			<div className="fixed inset-0 z-0 overflow-hidden">
				<svg
					className="absolute inset-0 w-full h-full"
					viewBox="0 0 1200 800"
					preserveAspectRatio="xMidYMid slice"
				>
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
				ref={containerRef}
				className="relative z-10 pt-32 pb-20 px-4"
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			>
				<div className="container mx-auto max-w-6xl">
					<motion.div
						ref={cardRef}
						style={{ rotateX, rotateY, transformPerspective: 1000 }}
						className="relative max-w-4xl mx-auto"
					>
						<div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-gray-200/50">
							<motion.div className="absolute -top-4 -right-4 w-20 h-20 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl z-20 floating-element" />
							<motion.div className="absolute -bottom-4 -left-4 w-24 h-24 bg-linear-to-tr from-amber-500 to-orange-500 rounded-2xl shadow-xl z-20 floating-element" />

							<div className="text-center">
								<h1
									className={`${bangers.className} text-6xl md:text-7xl mb-6 tracking-wider transform skew-x-[-5deg]`}
								>
									<span className="bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
										Web
									</span>
									<br />
									<span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
										Design
									</span>
								</h1>

								<motion.p
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
									className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
								>
									Create stunning, user-centered designs that captivate your
									audience and elevate your brand identity.
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
												'I came across your contact through your website. Hi, my name is',
											);
											const whatsappNumber = '2348145983735';
											window.open(
												`https://wa.me/${whatsappNumber}?text=${message}`,
												'_blank',
											);
										}}
										className="px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
									>
										Start Designing
									</button>
								</motion.div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Design Services */}
			<section className="relative z-10 py-20 px-4">
				<div className="container mx-auto max-w-6xl">
					<h2 className="text-4xl font-bold text-center mb-4">
						Design Services
					</h2>
					<p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
						Beautiful, functional designs that tell your brand's story
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{designServices.map((service, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-all group"
							>
								<div className="w-12 h-12 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
									{service.icon}
								</div>
								<h3 className="text-xl font-bold mb-2">{service.title}</h3>
								<p className="text-gray-600">{service.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Design Tools */}
			<section className="relative z-10 py-20 px-4 bg-linear-to-br from-purple-50 to-pink-50">
				<div className="container mx-auto max-w-6xl">
					<h2 className="text-4xl font-bold text-center mb-4">Tools We Use</h2>
					<p className="text-gray-600 text-center mb-12">
						Industry-standard design tools for exceptional results
					</p>

					<div className="flex flex-wrap gap-3 justify-center">
						{designTools.map((tool, index) => (
							<motion.span
								key={index}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.05 }}
								className="px-4 py-2 bg-white rounded-full text-gray-700 font-medium shadow-sm hover:shadow-md transition-all hover:scale-105"
							>
								{tool}
							</motion.span>
						))}
					</div>
				</div>
			</section>

			{/* Design Process */}
			<section className="relative z-10 py-20 px-4">
				<div className="container mx-auto max-w-6xl">
					<h2 className="text-4xl font-bold text-center mb-12">
						Our Design Process
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						{[
							{
								step: '01',
								title: 'Discovery',
								desc: 'Understanding your brand and goals',
							},
							{
								step: '02',
								title: 'Wireframing',
								desc: 'Structuring the user journey',
							},
							{
								step: '03',
								title: 'Visual Design',
								desc: 'Creating the look and feel',
							},
							{
								step: '04',
								title: 'Prototyping',
								desc: 'Testing and refinement',
							},
						].map((item, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="text-center"
							>
								<div className="text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
									{item.step}
								</div>
								<h3 className="text-xl font-bold mb-2">{item.title}</h3>
								<p className="text-gray-600">{item.desc}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="relative z-10 py-20 px-4">
				<div className="container mx-auto max-w-4xl">
					<div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
						<h2 className="text-4xl font-bold mb-4">
							Ready to Create Something Beautiful?
						</h2>
						<p className="text-xl mb-8 opacity-90">
							Let's bring your vision to life
						</p>
						<button className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
							Start Your Project
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}
