// app/services/ai-integration/page.tsx
'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Bangers } from 'next/font/google';
import {
	Bot,
	MessageSquare,
	Brain,
	Zap,
	Database,
	Cpu,
	Sparkles,
	Globe,
	Headphones,
} from 'lucide-react';

const bangers = Bangers({
	weight: '400',
	subsets: ['latin'],
});

export default function AIIntegrationPage() {
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

	const aiServices = [
		{
			icon: <MessageSquare className="w-6 h-6" />,
			title: 'AI Chatbots',
			description:
				'Intelligent customer service bots that handle inquiries 24/7.',
		},
		{
			icon: <Bot className="w-6 h-6" />,
			title: 'AI Agents',
			description:
				'Autonomous agents that perform complex tasks and workflows.',
		},
		{
			icon: <Brain className="w-6 h-6" />,
			title: 'Machine Learning',
			description: 'Custom ML models for predictions and data analysis.',
		},
		{
			icon: <Zap className="w-6 h-6" />,
			title: 'Process Automation',
			description: 'Automate repetitive tasks with intelligent workflows.',
		},
		{
			icon: <Database className="w-6 h-6" />,
			title: 'Data Processing',
			description: 'AI-powered data extraction, classification, and analysis.',
		},
		{
			icon: <Cpu className="w-6 h-6" />,
			title: 'Custom AI Solutions',
			description:
				'Tailored AI systems built for your specific business needs.',
		},
	];

	const useCases = [
		{
			title: 'Customer Support',
			description:
				'24/7 AI chatbots that handle inquiries, resolve issues, and escalate when needed',
			icon: <Headphones className="w-8 h-8" />,
		},
		{
			title: 'Lead Generation',
			description:
				'AI agents that qualify leads, schedule meetings, and nurture prospects',
			icon: <Sparkles className="w-8 h-8" />,
		},
		{
			title: 'Content Creation',
			description:
				'Generate blog posts, social media content, and marketing copy',
			icon: <Globe className="w-8 h-8" />,
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
							<motion.div className="absolute -top-4 -right-4 w-20 h-20 bg-linear-to-br from-purple-500 to-violet-500 rounded-2xl shadow-xl z-20 floating-element" />
							<motion.div className="absolute -bottom-4 -left-4 w-24 h-24 bg-linear-to-tr from-blue-500 to-cyan-500 rounded-2xl shadow-xl z-20 floating-element" />

							<div className="text-center">
								<h1
									className={`${bangers.className} text-6xl md:text-7xl mb-6 tracking-wider transform skew-x-[-5deg]`}
								>
									<span className="bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
										AI
									</span>
									<br />
									<span className="bg-linear-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
										Integration
									</span>
								</h1>

								<motion.p
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
									className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
								>
									Supercharge your business with custom AI solutions,
									intelligent chatbots, and autonomous agents that work 24/7.
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
												'I found your contact through your website and I’m interested in learning more about how AI integration can help improve traffic and user engagement on my platform. My name is  ',
											);
											const whatsappNumber = '2348145983735';
											window.open(
												`https://wa.me/${whatsappNumber}?text=${message}`,
												'_blank',
											);
										}}
										className="px-8 py-4 bg-linear-to-r from-purple-600 to-violet-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
									>
										Integrate AI Now
									</button>
								</motion.div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* AI Services Grid */}
			<section className="relative z-10 py-20 px-4">
				<div className="container mx-auto max-w-6xl">
					<h2 className="text-4xl font-bold text-center mb-4">AI Solutions</h2>
					<p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
						Harness the power of artificial intelligence to transform your
						business operations
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{aiServices.map((service, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-all group"
							>
								<div className="w-12 h-12 bg-linear-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
									{service.icon}
								</div>
								<h3 className="text-xl font-bold mb-2">{service.title}</h3>
								<p className="text-gray-600">{service.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Use Cases */}
			<section className="relative z-10 py-20 px-4 bg-linear-to-br from-purple-50 to-violet-50">
				<div className="container mx-auto max-w-6xl">
					<h2 className="text-4xl font-bold text-center mb-12">
						Real-World Applications
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{useCases.map((useCase, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
							>
								<div className="text-purple-600 mb-4">{useCase.icon}</div>
								<h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
								<p className="text-gray-600">{useCase.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="relative z-10 py-20 px-4">
				<div className="container mx-auto max-w-4xl">
					<div className="bg-linear-to-r from-purple-600 to-violet-600 rounded-3xl p-12 text-white">
						<h2 className="text-3xl font-bold text-center mb-8">
							Why Choose Our AI Solutions?
						</h2>
						<div className="grid grid-cols-2 gap-6">
							{[
								'24/7 Availability',
								'Natural Language Processing',
								'Multi-language Support',
								'Easy Integration',
								'Scalable Architecture',
								'Continuous Learning',
							].map((feature, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									className="flex items-center gap-3"
								>
									<Sparkles className="w-5 h-5 shrink-0" />
									<span>{feature}</span>
								</motion.div>
							))}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
