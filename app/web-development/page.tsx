// app/services/web-development/page.tsx (updated with WhatsApp)
'use client';

import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Bangers } from 'next/font/google';
import {
	Code2,
	Globe,
	Smartphone,
	Zap,
	Shield,
	Rocket,
	MessageCircle,
} from 'lucide-react';
import ProjectModal from '@/components/ProjectModal';

const bangers = Bangers({
	weight: '400',
	subsets: ['latin'],
});

export default function WebDevelopmentPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);

	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
	const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

	const rotateX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
	const rotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);

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

	const handleMouseLeave = () => {
		mouseX.set(0);
		mouseY.set(0);
	};

	const services = [
		{
			icon: <Globe className="w-6 h-6" />,
			title: 'Custom Web Applications',
			description:
				'Scalable, high-performance web apps built with modern frameworks like React, Next.js, and Node.js.',
		},
		{
			icon: <Smartphone className="w-6 h-6" />,
			title: 'Responsive Design',
			description:
				'Mobile-first designs that look perfect on every device, from smartphones to desktop screens.',
		},
		{
			icon: <Zap className="w-6 h-6" />,
			title: 'Performance Optimization',
			description:
				'Lightning-fast load times and smooth interactions for the best user experience.',
		},
		{
			icon: <Shield className="w-6 h-6" />,
			title: 'Security & Authentication',
			description:
				'Robust security measures including SSL, encryption, and secure user authentication.',
		},
		{
			icon: <Code2 className="w-6 h-6" />,
			title: 'API Development',
			description:
				'RESTful and GraphQL APIs that power your applications with seamless data integration.',
		},
		{
			icon: <Rocket className="w-6 h-6" />,
			title: 'SEO Optimization',
			description:
				'Built-in SEO best practices to ensure your site ranks high in search results.',
		},
	];

	const technologies = [
		'React/Next.js',
		'Vue.js',
		'Node.js',
		'Python/Django',
		'TypeScript',
		'GraphQL',
		'PostgreSQL',
		'MongoDB',
		'AWS',
		'Docker',
		'Tailwind CSS',
		'Framer Motion',
	];

	return (
		<>
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
								{/* Floating elements */}
								<motion.div className="absolute -top-4 -right-4 w-20 h-20 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl z-20 floating-element" />
								<motion.div className="absolute -bottom-4 -left-4 w-24 h-24 bg-linear-to-tr from-purple-500 to-pink-500 rounded-2xl shadow-xl z-20 floating-element" />

								<div className="text-center">
									<h1
										className={`${bangers.className} text-6xl md:text-7xl mb-6 tracking-wider transform skew-x-[-5deg]`}
									>
										<span className="bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
											Web
										</span>
										<br />
										<span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
											Development
										</span>
									</h1>

									<motion.p
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 }}
										className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
									>
										Build powerful, scalable web applications that drive
										business growth and deliver exceptional user experiences.
									</motion.p>

									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.4 }}
										className="flex gap-4 justify-center"
									>
										<button
											onClick={() => setIsModalOpen(true)}
											className="px-8 py-4 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
										>
											<MessageCircle className="w-5 h-5" />
											Start Your Project
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
						<h2 className="text-4xl font-bold text-center mb-4">
							What We Build
						</h2>
						<p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
							Comprehensive web development solutions tailored to your business
							needs
						</p>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{services.map((service, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-all group"
								>
									<div className="w-12 h-12 bg-linear-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
										{service.icon}
									</div>
									<h3 className="text-xl font-bold mb-2">{service.title}</h3>
									<p className="text-gray-600">{service.description}</p>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* Technologies */}
				<section className="relative z-10 py-20 px-4 bg-gray-50/50 backdrop-blur-sm">
					<div className="container mx-auto max-w-6xl">
						<h2 className="text-4xl font-bold text-center mb-4">
							Technologies We Use
						</h2>
						<p className="text-gray-600 text-center mb-12">
							Cutting-edge tools for modern web development
						</p>

						<div className="flex flex-wrap gap-3 justify-center">
							{technologies.map((tech, index) => (
								<motion.span
									key={index}
									initial={{ opacity: 0, scale: 0.8 }}
									whileInView={{ opacity: 1, scale: 1 }}
									transition={{ delay: index * 0.05 }}
									className="px-4 py-2 bg-white rounded-full text-gray-700 font-medium shadow-sm hover:shadow-md transition-all hover:scale-105"
								>
									{tech}
								</motion.span>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="relative z-10 py-20 px-4">
					<div className="container mx-auto max-w-4xl">
						<div className="bg-linear-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-center text-white">
							<h2 className="text-4xl font-bold mb-4">
								Ready to Build Something Amazing?
							</h2>
							<p className="text-xl mb-8 opacity-90">
								Let's turn your ideas into reality
							</p>
							<button
								onClick={() => setIsModalOpen(true)}
								className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 mx-auto"
							>
								<MessageCircle className="w-5 h-5" />
								Get in Touch on WhatsApp
							</button>
						</div>
					</div>
				</section>
			</div>

			{/* Project Modal */}
			<ProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
}
