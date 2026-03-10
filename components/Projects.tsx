'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bangers } from 'next/font/google';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const bangers = Bangers({
	weight: '400',
	subsets: ['latin'],
});

interface Project {
	id: string;
	title: string;
	category: string;
	description: string;
	image: string;
	href: string;
	color: string;
}

const projects: Project[] = [
	{
		id: 'project-1',
		title: 'Luxury Retail Platform',
		category: 'E-Commerce',
		description: 'A high-end shopping experience with AI personalization',
		image:
			'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2000&auto=format&fit=crop',
		href: '#',
		color: 'from-blue-600/20 to-blue-400/20',
	},
	{
		id: 'project-2',
		title: 'NeoBank Mobile App',
		category: 'Fintech',
		description:
			'Next-gen banking with biometric security and instant payments',
		image:
			'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2000&auto=format&fit=crop',
		href: '#',
		color: 'from-blue-600/20 to-blue-400/20',
	},
	{
		id: 'project-3',
		title: 'Healthcare Portal',
		category: 'HealthTech',
		description: 'Patient-first platform with telemedicine integration',
		image:
			'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop',
		href: '#',
		color: 'from-blue-600/20 to-blue-400/20',
	},
];

// Bouncing ball animation component
const BouncingBallAnimation = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas dimensions
		const updateDimensions = () => {
			const container = canvas.parentElement;
			if (container) {
				const width = container.offsetWidth;
				const height = container.offsetHeight;
				setDimensions({ width, height });
				canvas.width = width;
				canvas.height = height;
			}
		};

		updateDimensions();
		window.addEventListener('resize', updateDimensions);

		// Ball properties
		let x = 100;
		let y = 100;
		let vx = 2;
		let vy = 2;
		const radius = 8;

		// Trail properties
		const trailPoints: { x: number; y: number; opacity: number }[] = [];
		const maxTrailLength = 20;

		// Animation loop
		const animate = () => {
			if (!ctx || !canvas) return;

			// Clear canvas with fade effect
			ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Update ball position
			x += vx;
			y += vy;

			// Bounce off walls
			if (x + radius > canvas.width || x - radius < 0) {
				vx *= -1;
			}
			if (y + radius > canvas.height || y - radius < 0) {
				vy *= -1;
			}

			// Add current position to trail
			trailPoints.push({ x, y, opacity: 1 });
			if (trailPoints.length > maxTrailLength) {
				trailPoints.shift();
			}

			// Draw trail lines
			ctx.beginPath();
			for (let i = 0; i < trailPoints.length - 1; i++) {
				const point = trailPoints[i];
				const nextPoint = trailPoints[i + 1];
				const opacity = point.opacity * (i / trailPoints.length);

				// Draw line with gradient opacity
				ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.5})`;
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(point.x, point.y);
				ctx.lineTo(nextPoint.x, nextPoint.y);
				ctx.stroke();

				// Update opacity for next frame
				point.opacity *= 0.95;
			}

			// Draw ball
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);

			// Create gradient for ball - brighter colors for better visibility
			const gradient = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, radius);
			gradient.addColorStop(0, '#93c5fd');
			gradient.addColorStop(0.5, '#3b82f6');
			gradient.addColorStop(1, '#1e40af');

			ctx.fillStyle = gradient;
			ctx.fill();

			// Add highlight
			ctx.beginPath();
			ctx.arc(x - 2, y - 2, 2, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
			ctx.fill();

			// Add glow effect
			ctx.shadowColor = '#3b82f6';
			ctx.shadowBlur = 20;
			ctx.beginPath();
			ctx.arc(x, y, radius + 2, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
			ctx.fill();

			// Reset shadow
			ctx.shadowBlur = 0;

			requestAnimationFrame(animate);
		};

		const animationId = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener('resize', updateDimensions);
			cancelAnimationFrame(animationId);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 w-full h-full pointer-events-none"
			style={{ background: 'transparent' }}
		/>
	);
};

// Past Projects Section Component
const PastProjectsSection = () => {
	const sectionRef = useRef<HTMLElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!sectionRef.current || !contentRef.current) return;

		const ctx = gsap.context(() => {
			// Simple fade-in animation for content
			// Use optional chaining and type assertion to ensure contentRef.current is not null
			if (contentRef.current) {
				gsap.from(contentRef.current.children, {
					opacity: 0,
					y: 30,
					stagger: 0.2,
					duration: 1,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: sectionRef.current,
						start: 'top 80%',
						end: 'bottom 20%',
						toggleActions: 'play none none reverse',
					},
				});
			}

			// Subtle parallax for background
			gsap.to('.project-bg-image', {
				scale: 1.1,
				ease: 'none',
				scrollTrigger: {
					trigger: sectionRef.current,
					start: 'top bottom',
					end: 'bottom top',
					scrub: 1.5,
				},
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			className="relative py-20 md:py-28 overflow-hidden bg-black"
		>
			{/* Background Image with Parallax */}
			<div className="absolute inset-0 w-full h-full">
				<Image
					src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2000&auto=format&fit=crop"
					alt="Past Projects Background"
					fill
					className="project-bg-image object-cover opacity-40"
					priority
				/>
				<div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/60 to-black/80" />
			</div>

			{/* Content */}
			<div className="container relative z-10 mx-auto px-4 md:px-8">
				<div
					ref={contentRef}
					className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center"
				>
					{/* Left Column - Text Content */}
					<div className="max-w-lg">
						{/* Section Label */}
						<div className="mb-4 inline-block">
							<span className="text-xs font-mono text-blue-400 border border-blue-400/30 px-3 py-1.5 rounded-full">
								PAST PROJECTS
							</span>
						</div>

						{/* Title */}
						<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
							<span className="bg-linear-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
								Featured
							</span>{' '}
							<span className="text-white">Work</span>
						</h2>

						{/* Description */}
						<p className="text-base md:text-lg text-gray-300 mb-8">
							Explore our portfolio of transformative digital experiences across
							industries. Each project represents our commitment to excellence
							and innovation.
						</p>

						{/* Stats */}
						<div className="flex gap-8 mb-8">
							<div>
								<div className="text-2xl md:text-3xl font-bold text-white">
									10+
								</div>
								<div className="text-sm text-gray-400">Projects</div>
							</div>
							<div>
								<div className="text-2xl md:text-3xl font-bold text-white">
									3
								</div>
								<div className="text-sm text-gray-400">Industries</div>
							</div>
							<div>
								<div className="text-2xl md:text-3xl font-bold text-white">
									100%
								</div>
								<div className="text-sm text-gray-400">Satisfaction</div>
							</div>
						</div>

						{/* CTA Button */}
						<Link
							href="/industries?tab=e-commerce"
							className="group inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-blue-500 transition-all duration-300"
						>
							<span>View All Projects</span>
							<svg
								className="w-4 h-4 group-hover:translate-x-1 transition-transform"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								/>
							</svg>
						</Link>
					</div>

					{/* Right Column - Featured Project Cards */}
					<div className="lg:pl-4">
						<div className="grid grid-cols-2 gap-4">
							{projects.slice(0, 2).map((project) => (
								<Link
									key={project.id}
									href={project.href}
									className="group block aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
								>
									<div className="relative w-full h-full">
										<Image
											src={project.image}
											alt={project.title}
											fill
											className="object-cover group-hover:scale-110 transition-transform duration-700"
										/>
										<div
											className={`absolute inset-0 bg-linear-to-t ${project.color} mix-blend-overlay`}
										/>
										<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
										<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
											<div className="text-xs font-mono text-white/60 mb-1">
												{project.category}
											</div>
											<h3 className="text-sm font-bold line-clamp-1">
												{project.title}
											</h3>
										</div>
									</div>
								</Link>
							))}
						</div>
						{/* Third card below */}
						{projects[2] && (
							<Link
								href={projects[2].href}
								className="group block mt-4 aspect-3/1 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
							>
								<div className="relative w-full h-full">
									<Image
										src={projects[2].image}
										alt={projects[2].title}
										fill
										className="object-cover group-hover:scale-110 transition-transform duration-700"
									/>
									<div
										className={`absolute inset-0 bg-linear-to-t ${projects[2].color} mix-blend-overlay`}
									/>
									<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
									<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
										<div className="text-xs font-mono text-white/60 mb-1">
											{projects[2].category}
										</div>
										<h3 className="text-sm font-bold line-clamp-1">
											{projects[2].title}
										</h3>
									</div>
								</div>
							</Link>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

// CTA & Footer Section Component
const CTAFooterSection = () => {
	const sectionRef = useRef<HTMLElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	// Social media links (same as navbar)
	const socialLinks = {
		facebook: 'https://facebook.com/yourpage',
		instagram: 'https://instagram.com/yourpage',
		whatsapp: 'https://wa.me/2348145983735',
	};

	useEffect(() => {
		if (!sectionRef.current || !contentRef.current) return;

		const ctx = gsap.context(() => {
			// Simple fade-in animation for content
			// Use optional chaining and type assertion to ensure contentRef.current is not null
			if (contentRef.current) {
				gsap.from(contentRef.current.children, {
					opacity: 0,
					y: 30,
					stagger: 0.2,
					duration: 1,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: sectionRef.current,
						start: 'top 80%',
						end: 'bottom 20%',
						toggleActions: 'play none none reverse',
					},
				});
			}
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<>
			<style jsx global>{`
				@keyframes slow-spin {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}
				.animate-slow-spin {
					animation: slow-spin 12s linear infinite;
				}
			`}</style>

			<section ref={sectionRef} className="relative bg-white">
				{/* CTA Section with Bouncing Ball */}
				<div
					ref={contentRef}
					className="bg-linear-to-br from-blue-600 to-blue-400 px-4 md:px-8 py-16 md:py-20 relative overflow-hidden"
				>
					{/* Bouncing Ball Animation */}
					<div className="absolute inset-0 pointer-events-none opacity-30">
						<BouncingBallAnimation />
					</div>

					{/* Mobile: Circular decoration */}
					<div className="absolute inset-0 flex items-center justify-center lg:hidden opacity-20 pointer-events-none">
						<div className="relative w-48 h-48">
							<svg
								className="w-full h-full absolute inset-0 animate-slow-spin"
								viewBox="0 0 200 200"
								xmlns="http://www.w3.org/2000/svg"
							>
								<defs>
									<path
										id="circlePathMobile"
										d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
										fill="none"
									/>
								</defs>
								<text
									className="text-[10px] font-light fill-white/30"
									letterSpacing="3"
								>
									<textPath
										href="#circlePathMobile"
										startOffset="0%"
										method="align"
										spacing="auto"
									>
										WE CREATE • WE'RE WITH YOU • TIME AND TIME AGAIN •
									</textPath>
								</text>
							</svg>

							{/* Centered Logo */}
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center shadow-xl">
									<span
										className={`${bangers.className} text-white text-xl transform skew-x-[-5deg]`}
									>
										L
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="w-full max-w-7xl mx-auto relative z-10">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
							{/* Left side - Headline and CTA */}
							<div>
								<h2
									className={`${bangers.className} text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 transform skew-x-[-5deg]`}
								>
									Creating websites that not only look great but drive real
									results for your business.
								</h2>
								<Link href="/contact">
									<button className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium text-lg hover:bg-gray-100 transition-colors skew-x-[-20deg] shadow-lg">
										Reach Out
									</button>
								</Link>
							</div>

							{/* Desktop Right side - Circular text decoration */}
							<div className="hidden lg:flex justify-end items-center relative h-48">
								<div className="relative w-48 h-48">
									<svg
										className="w-full h-full absolute inset-0 animate-slow-spin"
										viewBox="0 0 200 200"
										xmlns="http://www.w3.org/2000/svg"
									>
										<defs>
											<path
												id="circlePathDesktop"
												d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
												fill="none"
											/>
										</defs>
										<text
											className="text-xs font-light fill-white/70"
											letterSpacing="3"
										>
											<textPath
												href="#circlePathDesktop"
												startOffset="0%"
												method="align"
												spacing="auto"
											>
												WE DESIGN • WE DEVELOP • WE DELIVER • ALWAYS{' '}
											</textPath>
										</text>
									</svg>

									{/* Centered Logo */}
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="w-14 h-14 bg-linear-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center shadow-xl">
											<span
												className={`${bangers.className} text-white text-2xl transform skew-x-[-5deg]`}
											>
												L
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Footer Section */}
				<div className="bg-white px-4 md:px-8 py-8 border-t border-gray-200">
					<div className="w-full max-w-7xl mx-auto">
						{/* Desktop Layout (md and up) */}
						<div className="hidden md:grid grid-cols-3 gap-6 items-center">
							{/* Left - Logo/Brand */}
							<div className="text-gray-900">
								<div
									className={`${bangers.className} text-4xl transform skew-x-[-8deg]`}
								>
									WandLabs
								</div>
								<div className="text-xs text-gray-500 mt-2">
									© 2025 All rights reserved.
								</div>
							</div>

							{/* Center - Navigation */}
							<div
								className={`${bangers.className} flex justify-center gap-4 md:gap-6 flex-wrap text-gray-900`}
							>
								<Link
									href="/"
									className="text-xs lg:text-sm transform skew-x-[-5deg] hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r hover:from-blue-600 hover:to-blue-400 transition-all duration-200"
								>
									HOME
								</Link>
								<Link
									href="/about-us"
									className="text-xs lg:text-sm transform skew-x-[-5deg] hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r hover:from-blue-600 hover:to-blue-400 transition-all duration-200"
								>
									ABOUT US
								</Link>
								<Link
									href="/services/web-development"
									className="text-xs lg:text-sm transform skew-x-[-5deg] hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r hover:from-blue-600 hover:to-blue-400 transition-all duration-200"
								>
									SERVICES
								</Link>
								<Link
									href="/industries/e-commerce"
									className="text-xs lg:text-sm transform skew-x-[-5deg] hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r hover:from-blue-600 hover:to-blue-400 transition-all duration-200"
								>
									INDUSTRIES
								</Link>
								<Link
									href="/contact-us"
									className="text-xs lg:text-sm transform skew-x-[-5deg] hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r hover:from-blue-600 hover:to-blue-400 transition-all duration-200"
								>
									CONTACT US
								</Link>
							</div>

							{/* Right - Social Icons */}
							<div className="flex justify-end gap-2">
								<Link
									href={socialLinks.facebook}
									target="_blank"
									rel="noopener noreferrer"
									className="w-7 h-7 bg-linear-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
								>
									<FaFacebookF size={12} />
								</Link>
								<Link
									href={socialLinks.instagram}
									target="_blank"
									rel="noopener noreferrer"
									className="w-7 h-7 bg-linear-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
								>
									<FaInstagram size={12} />
								</Link>
								<Link
									href={socialLinks.whatsapp}
									target="_blank"
									rel="noopener noreferrer"
									className="w-7 h-7 bg-linear-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
								>
									<FaWhatsapp size={12} />
								</Link>
							</div>
						</div>

						{/* Mobile Layout */}
						<div className="flex md:hidden flex-col gap-6">
							{/* Navigation Links */}
							<div
								className={`${bangers.className} flex justify-center gap-4 flex-wrap text-gray-900`}
							>
								<Link
									href="/"
									className="text-xs transform skew-x-[-5deg] hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r hover:from-blue-600 hover:to-blue-400 transition-all duration-200"
								>
									HOME
								</Link>
								<Link
									href="/about"
									className="text-xs transform skew-x-[-5deg] hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r hover:from-blue-600 hover:to-blue-400 transition-all duration-200"
								>
									ABOUT US
								</Link>
								<Link
									href="/web-development"
									className="text-xs transform skew-x-[-5deg] hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r hover:from-blue-600 hover:to-blue-400 transition-all duration-200"
								>
									SERVICES
								</Link>
								<Link
									href="/industries?tab=e-commerce"
									className="text-xs transform skew-x-[-5deg] hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r hover:from-blue-600 hover:to-blue-400 transition-all duration-200"
								>
									INDUSTRIES
								</Link>
								<Link
									href="/contact"
									className="text-xs transform skew-x-[-5deg] hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r hover:from-blue-600 hover:to-blue-400 transition-all duration-200"
								>
									CONTACT US
								</Link>
							</div>

							{/* Logo and Social */}
							<div className="flex items-center justify-between">
								<div className="text-gray-900">
									<div
										className={`${bangers.className} text-3xl transform skew-x-[-5deg]`}
									>
										WandLabs
									</div>
									<div className="text-xs text-gray-500 mt-1">
										© 2025 All rights reserved.
									</div>
								</div>

								<div className="flex gap-2 mr-20 md:mr-0">
									<Link
										href={socialLinks.facebook}
										target="_blank"
										rel="noopener noreferrer"
										className="w-7 h-7 bg-linear-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
									>
										<FaFacebookF size={12} />
									</Link>
									<Link
										href={socialLinks.instagram}
										target="_blank"
										rel="noopener noreferrer"
										className="w-7 h-7 bg-linear-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
									>
										<FaInstagram size={12} />
									</Link>
									<Link
										href={socialLinks.whatsapp}
										target="_blank"
										rel="noopener noreferrer"
										className="w-7 h-7 bg-linear-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
									>
										<FaWhatsapp size={12} />
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

// Main component that combines both sections
export default function PastProjects() {
	return (
		<>
			<PastProjectsSection />
			<CTAFooterSection />
		</>
	);
}
