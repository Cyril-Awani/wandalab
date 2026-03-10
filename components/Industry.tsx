'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Industry {
	id: string;
	title: string;
	description: string;
	image: string;
	href: string;
}

const industries: Industry[] = [
	{
		id: 'ecommerce',
		title: 'Hospitality',
		description: 'AI-powered shopping experiences that convert',
		image:
			'https://www.steakclub-newyork.de/_next/image?url=%2Fhero_left.png&w=1200&q=75',
		href: '#',
	},
	{
		id: 'fintech',
		title: 'Fintech',
		description: 'Secure, scalable solutions for modern finance',
		image:
			'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1000&auto=format&fit=crop',
		href: '#',
	},
	{
		id: 'startups',
		title: 'Startups',
		description: 'From MVP to market leader—faster',
		image:
			'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1000&auto=format&fit=crop',
		href: '#',
	},
	{
		id: 'oil-gas',
		title: 'Oil & Gas',
		description: 'Digital transformation for energy sectors',
		image:
			'https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b2lsJTIwYW5kJTIwZ2FzfGVufDB8fDB8fHww',
		href: '#',
	},
	{
		id: 'banking',
		title: 'Banking',
		description: 'Next-gen banking with enterprise security',
		image:
			'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJhbmtpbmd8ZW58MHx8MHx8fDA%3D',
		href: '#',
	},
	{
		id: 'real-estate',
		title: 'Real Estate',
		description: 'Immersive property experiences',
		image:
			'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop',
		href: '#',
	},
	{
		id: 'event-marketing',
		title: 'Event Marketing',
		description: 'Platforms that engage global audiences',
		image:
			'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=1000&auto=format&fit=crop',
		href: '#',
	},
	{
		id: 'healthcare',
		title: 'Healthcare',
		description: 'Patient-first digital solutions',
		image:
			'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop',
		href: '#',
	},
];

export default function IndustriesCarousel() {
	const trackRef = useRef<HTMLDivElement>(null);
	const sectionRef = useRef<HTMLDivElement>(null);
	const [showLeftFade, setShowLeftFade] = useState(false);
	const [showRightFade, setShowRightFade] = useState(true);

	const handleScroll = () => {
		if (!trackRef.current) return;

		const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
		setShowLeftFade(scrollLeft > 20);
		setShowRightFade(scrollLeft < scrollWidth - clientWidth - 20);
	};

	// Initialize carousel scroll and GSAP scroll trigger effects
	useEffect(() => {
		const track = trackRef.current;
		const section = sectionRef.current;
		if (!track || !section) return;

		// Set up scroll event listener for fade visibility
		track.addEventListener('scroll', handleScroll);
		handleScroll();

		// GSAP ScrollTrigger effect: Parallax scroll on cards
		const cards = track.querySelectorAll('a');

		// Create a timeline for subtle animations
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				start: 'top center',
				end: 'bottom center',
				scrub: 0.5, // Smooth scrubbing (0.5 = slight lag for organic feel)
				markers: false,
			},
		});

		// Animate individual cards with slight offset
		cards.forEach((card, index) => {
			tl.to(
				card,
				{
					x: index % 2 === 0 ? -5 : 5, // Alternating offset
					opacity: 0.85,
					duration: 1,
				},
				0, // Play all at once
			);
		});

		// Initial carousel centering
		const containerWidth = track.clientWidth;
		const firstCard = track.children[0] as HTMLElement;
		if (firstCard) {
			const cardLeft = firstCard.offsetLeft;
			const cardWidth = firstCard.offsetWidth;
			const targetScroll = cardLeft - containerWidth / 2 + cardWidth / 2;
			track.scrollLeft = targetScroll;
		}

		return () => {
			track.removeEventListener('scroll', handleScroll);
			// Kill the timeline to prevent memory leaks
			tl.kill();
			ScrollTrigger.getAll().forEach((trigger) => {
				if (trigger.vars.trigger === section) {
					trigger.kill();
				}
			});
		};
	}, []);

	const snapToNearestCard = (direction: 'left' | 'right') => {
		if (!trackRef.current) return;

		const track = trackRef.current;
		const currentScroll = track.scrollLeft;
		const containerWidth = track.clientWidth;

		const cards = Array.from(track.children) as HTMLElement[];

		if (cards.length === 0) return;

		const viewportCenter = currentScroll + containerWidth / 2;

		let targetCardIndex = 0;
		let minDistance = Infinity;

		cards.forEach((card, index) => {
			const cardLeft = card.offsetLeft;
			const cardRight = cardLeft + card.offsetWidth;
			const cardCenter = (cardLeft + cardRight) / 2;

			const distance = Math.abs(cardCenter - viewportCenter);

			if (distance < minDistance) {
				minDistance = distance;
				targetCardIndex = index;
			}
		});

		if (direction === 'left') {
			targetCardIndex = Math.max(0, targetCardIndex - 1);
		} else {
			targetCardIndex = Math.min(cards.length - 1, targetCardIndex + 1);
		}

		const targetCard = cards[targetCardIndex];
		const targetCardLeft = targetCard.offsetLeft;
		const targetCardWidth = targetCard.offsetWidth;

		const targetScroll =
			targetCardLeft - containerWidth / 2 + targetCardWidth / 2;

		track.scrollTo({
			left: targetScroll,
			behavior: 'smooth',
		});
	};

	return (
		<section
			ref={sectionRef}
			className="relative bg-white py-24 md:py-32 overflow-hidden"
		>
			{/* Header */}
			<div className="relative container mx-auto px-6 md:px-16 mb-12 md:mb-16">
				<h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
					Industries{' '}
					<span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						We Design For
					</span>
				</h2>
				<p className="text-base md:text-lg text-gray-600 max-w-2xl mt-4">
					From fintech to healthcare, we craft digital experiences that resonate
					with your audience and drive real business results.
				</p>
			</div>

			{/* Navigation Arrows */}
			<div className="relative container mx-auto px-6 md:px-16 mb-4 flex justify-end gap-2">
				<button
					onClick={() => snapToNearestCard('left')}
					className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
					disabled={!showLeftFade}
					aria-label="Scroll left"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
				<button
					onClick={() => snapToNearestCard('right')}
					className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
					disabled={!showRightFade}
					aria-label="Scroll right"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>

			{/* Carousel Container with Fade Edges */}
			<div className="relative">
				{/* Scrollable Track - Hidden Scrollbar */}
				<div
					ref={trackRef}
					onScroll={handleScroll}
					className="flex gap-6 md:gap-8 px-6 md:px-16 py-6 md:py-10 overflow-x-auto scroll-smooth cursor-grab active:cursor-grabbing hide-scrollbar"
					style={{
						WebkitOverflowScrolling: 'touch',
					}}
				>
					{industries.map((industry, index) => (
						<Link
							key={industry.id}
							href={industry.href}
							className="group block shrink-0 snap-start"
						>
							<div
								className="
									relative
									min-w-70 md:min-w-95 lg:min-w-105
									h-65 md:h-75 lg:h-80
									rounded-2xl md:rounded-3xl
									overflow-hidden
									shadow-lg
									transition-all
									duration-700
									group-hover:scale-[1.02]
									group-hover:shadow-sm
								"
							>
								{/* Background Image */}
								<div className="absolute inset-0 w-full h-full">
									<Image
										src={industry.image}
										alt={industry.title}
										fill
										className="object-cover transition-transform duration-1000 group-hover:scale-110"
										sizes="(max-width: 768px) 280px, (max-width: 1024px) 380px, 420px"
										priority={index === 0}
									/>
								</div>

								{/* Content */}
								<div className="absolute inset-0 p-6 md:p-8 lg:p-10 flex flex-col justify-end text-white">
									<h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
										{industry.title}
									</h3>
									<p className="text-xs md:text-sm text-white/80 max-w-50 md:max-w-55 leading-relaxed">
										{industry.description}
									</p>

									{/* Subtle arrow indicator */}
									<div className="absolute bottom-6 md:bottom-8 lg:bottom-10 right-6 md:right-8 lg:right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
										<svg
											className="w-4 h-4 md:w-5 md:h-5 text-white"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={1.5}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M17 8l4 4m0 0l-4 4m4-4H3"
											/>
										</svg>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* Scroll indicator for mobile */}
			<div className="md:hidden text-center mt-4 text-xs text-gray-400">
				Swipe to explore →
			</div>
		</section>
	);
}
