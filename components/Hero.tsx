'use client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

interface HeroProps {
	// Add any props if needed
}

const Hero: React.FC<HeroProps> = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);

	// Mouse position for 3D tilt
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	// Smooth spring animations for the tilt
	const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
	const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

	// Transform mouse position to rotation values
	const rotateX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
	const rotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);

	// Floating animation for background elements
	useEffect(() => {
		const ctx = gsap.context(() => {
			// Animate floating circles
			gsap.to('.floating-circle', {
				y: 'random(-20, 20)',
				x: 'random(-20, 20)',
				duration: 'random(3, 6)',
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
				stagger: 0.2,
			});

			// Animate linear orbs
			gsap.to('.linear-orb', {
				scale: 1.1,
				opacity: 0.6,
				duration: 'random(4, 8)',
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
			});
		});

		return () => ctx.revert();
	}, []);

	// Handle mouse move for 3D effect
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!cardRef.current) return;

		const rect = cardRef.current.getBoundingClientRect();

		// Calculate mouse position relative to card center (between -0.5 and 0.5)
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;

		mouseX.set(x);
		mouseY.set(y);
	};

	const handleMouseLeave = () => {
		mouseX.set(0);
		mouseY.set(0);
	};

	return (
		<section
			ref={containerRef}
			className="relative min-h-dvh bg-white overflow-hidden"
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			{/* Distorted Grid Background Layer - BOTTOM - Smaller grid */}
			<div className="absolute inset-0 z-0 overflow-hidden">
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

					{/* Animated distorted grid lines - Smaller and denser */}
					<motion.g filter="url(#gridWarp)">
						{/* Vertical lines - more lines for smaller grid */}
						{Array.from({ length: 30 }).map((_, i) => (
							<line
								key={`v-${i}`}
								x1={i * 40}
								y1={0}
								x2={i * 40}
								y2={800}
								stroke="rgba(0, 0, 0, 0.1)"
								strokeWidth="1"
								vectorEffect="non-scaling-stroke"
							/>
						))}
						{/* Horizontal lines - more lines for smaller grid */}
						{Array.from({ length: 20 }).map((_, i) => (
							<line
								key={`h-${i}`}
								x1={0}
								y1={i * 40}
								x2={1200}
								y2={i * 40}
								stroke="rgba(0, 0, 0, 0.1)"
								strokeWidth="1"
								vectorEffect="non-scaling-stroke"
							/>
						))}
					</motion.g>
				</svg>
			</div>

			{/* Main Content */}
			<div className="relative z-10 container mx-auto px-4 min-h-dvh flex flex-col items-center justify-center">
				{/* 3D Card with Tilt Effect - Reduced Size */}
				<motion.div
					ref={cardRef}
					style={{
						rotateX,
						rotateY,
						transformPerspective: 1000,
						transformStyle: 'preserve-3d',
					}}
					className="relative w-full max-w-2xl cursor-pointer"
				>
					{/* Main Card - Reduced padding and text sizes */}
					<div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50">
						{/* Floating elements inside card - Scaled down */}
						<motion.div
							className="absolute -top-3 -right-3 w-16 h-16 bg-linear-to-br from-blue-500 to-purple-500 rounded-2xl shadow-xl z-20"
							animate={{
								y: [0, -8, 0],
								rotate: [0, 5, 0],
							}}
							transition={{
								duration: 4,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
						/>

						<motion.div
							className="absolute -bottom-3 -left-3 w-20 h-20 bg-linear-to-tr from-pink-500 to-orange-500 rounded-2xl shadow-xl z-20"
							animate={{
								y: [0, 8, 0],
								rotate: [0, -5, 0],
							}}
							transition={{
								duration: 5,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
						/>

						{/* Content - Reduced text sizes */}
						<div className="text-center relative">
							<motion.h1
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}
								className="text-4xl md:text-5xl font-bold mb-4"
							>
								<span className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
									Create Amazing
								</span>
								<br />
								<span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
									Digital Experiences
								</span>
							</motion.h1>

							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-base text-gray-600 mb-8 max-w-lg mx-auto"
							>
								Transform your vision into reality with our cutting-edge
								solutions and innovative approach to digital design.
							</motion.p>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.4 }}
								className="flex flex-col sm:flex-row gap-3 justify-center relative z-30"
							>
								<Link href="/contact">
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-shadow"
									>
										Get Started
									</motion.button>
								</Link>
							</motion.div>
						</div>
					</div>

					{/* Reflection/Shadow effect - Scaled down */}
					<div className="absolute inset-0 -z-10 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl transform translate-y-3 scale-95" />
				</motion.div>

				{/* Scroll Indicator with "scroll down" text */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1 }}
					className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20"
				>
					<motion.div
						animate={{ y: [0, 8, 0] }}
						transition={{ duration: 1.5, repeat: Infinity }}
						className="w-5 h-8 border-2 border-gray-400 rounded-full flex justify-center mb-2"
					>
						<motion.div
							animate={{ height: [8, 14, 8] }}
							transition={{ duration: 1.5, repeat: Infinity }}
							className="w-1 bg-gray-400 rounded-full mt-2"
						/>
					</motion.div>
					<motion.span
						animate={{ opacity: [0.5, 1, 0.5] }}
						transition={{ duration: 2, repeat: Infinity }}
						className="text-xs font-medium text-gray-500 tracking-wider uppercase"
					>
						Scroll Down
					</motion.span>
				</motion.div>
			</div>
		</section>
	);
};

export default Hero;
