'use client';
import { Bangers } from 'next/font/google';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

interface NavbarProps {
	// Add any props if needed
}

const bangers = Bangers({
	weight: '400',
	subsets: ['latin'],
});

const Navbar: React.FC<NavbarProps> = () => {
	const pathname = usePathname();
	const [isScrolled, setIsScrolled] = useState<boolean>(false);
	const [isServicesOpen, setIsServicesOpen] = useState<boolean>(false);
	const [isIndustriesOpen, setIsIndustriesOpen] = useState<boolean>(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
	const [isHeroSection, setIsHeroSection] = useState<boolean>(true);
	const [hoveredItem, setHoveredItem] = useState<string | null>(null);
	const [activeItem, setActiveItem] = useState<string>('home');
	const [isMobileServicesOpen, setIsMobileServicesOpen] =
		useState<boolean>(false);
	const [isMobileIndustriesOpen, setIsMobileIndustriesOpen] =
		useState<boolean>(false);

	// Refs for dropdown click outside detection
	const servicesRef = useRef<HTMLDivElement>(null);
	const industriesRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = (): void => {
			const heroHeight = window.innerHeight * 0.08;
			const scrolled = window.scrollY > heroHeight;
			setIsScrolled(scrolled);
			setIsHeroSection(window.scrollY < heroHeight);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Handle click outside to close dropdowns
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				servicesRef.current &&
				!servicesRef.current.contains(event.target as Node)
			) {
				setIsServicesOpen(false);
			}
			if (
				industriesRef.current &&
				!industriesRef.current.contains(event.target as Node)
			) {
				setIsIndustriesOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Prevent body scroll when mobile menu is open
	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isMobileMenuOpen]);

	const menuItems = [
		{ name: 'HOME', href: '/', id: 'home' },
		{ name: 'ABOUT US', href: '/about', id: 'about' },
		{ name: 'CONTACT US', href: '/contact', id: 'contact' },
	];

	const servicesItems = [
		{ name: 'Web Development', href: '/web-development' },
		{ name: 'Web Design', href: '/web-design' },
		{ name: 'Digital Marketing', href: '/digital-marketing' },
		{ name: 'AI Integration', href: '/ai-integration' },
	];

	// Updated industries items - only 3 items now
	const industriesItems = [
		{
			name: 'E-commerce',
			href: '/industries?tab=e-commerce',
			id: 'e-commerce',
		},
		{
			name: 'Restaurants & Hospitality',
			href: '/industries?tab=restaurants-hospitality',
			id: 'restaurants-hospitality',
		},
		{
			name: 'Events & Entertainment',
			href: '/industries?tab=events-entertainment',
			id: 'events-entertainment',
		},
	];

	// Blue glow animation - FIXED with proper easing for keyframe animation
	const blueGlowAnimation = {
		scale: [1, 1.03, 1],
		filter: [
			'drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))',
			'drop-shadow(0 0 15px rgba(59, 130, 246, 0.7))',
			'drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))',
		],
		transition: {
			duration: 2,
			repeat: Infinity,
			ease: 'easeInOut' as const,
		},
	};

	// Stagger animation variants for mobile menu items
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05,
				delayChildren: 0.2,
			},
		},
		exit: {
			opacity: 0,
			transition: {
				staggerChildren: 0.03,
				staggerDirection: -1,
			},
		},
	};

	const itemVariants: Variants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: 'spring',
				stiffness: 300,
				damping: 24,
			},
		},
		exit: {
			y: 20,
			opacity: 0,
			transition: {
				duration: 0.2,
			},
		},
	};

	const mobileServicesVariants: Variants = {
		hidden: { height: 0, opacity: 0 },
		visible: {
			height: 'auto',
			opacity: 1,
			transition: {
				duration: 0.3,
			},
		},
		exit: {
			height: 0,
			opacity: 0,
			transition: {
				duration: 0.2,
			},
		},
	};

	// Determine background style based on page and scroll
	const getNavbarStyle = () => {
		const isHomePage = pathname === '/';

		// Base styles for all states
		let styles =
			'fixed top-4 left-1/2 -translate-x-1/2 w-[95%] lg:w-[90%] max-w-7xl z-30 transition-all duration-300 ';

		// Background and shadow based on state
		if (isMobileMenuOpen) {
			styles += 'bg-white rounded-2xl shadow-2xl';
		} else if (isHomePage && !isScrolled && isHeroSection) {
			styles += 'bg-transparent';
		} else {
			styles += 'bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl';
		}

		return styles;
	};

	// Check if item should have blue glow animation
	const shouldAnimate = (itemId: string) => {
		return hoveredItem === itemId || activeItem === itemId;
	};

	// Social media links
	const socialLinks = {
		facebook: 'https://facebook.com/yourpage',
		instagram: 'https://instagram.com/yourpage',
		whatsapp: 'https://wa.me/2348145983735',
	};

	// Toggle functions for click-based dropdowns
	const toggleServices = () => {
		setIsServicesOpen(!isServicesOpen);
		setIsIndustriesOpen(false); // Close other dropdown
	};

	const toggleIndustries = () => {
		setIsIndustriesOpen(!isIndustriesOpen);
		setIsServicesOpen(false); // Close other dropdown
	};

	return (
		<>
			<motion.nav
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
				className={getNavbarStyle()}
				onMouseLeave={() => {
					setHoveredItem(null);
				}}
			>
				<div className="px-6 lg:px-8 py-3 lg:py-4 flex justify-between items-center">
					{/* Logo with blue glow */}
					<motion.div
						whileHover="hover"
						onHoverStart={() => setHoveredItem('logo')}
						onHoverEnd={() => setHoveredItem(null)}
						onClick={() => setActiveItem('home')}
						className="shrink-0"
					>
						<Link
							href="/"
							className="text-2xl lg:text-3xl font-bangers tracking-wider z-50 text-gray-900 block transform skew-x-[-8deg]"
						>
							<motion.span
								animate={shouldAnimate('logo') ? blueGlowAnimation : {}}
								className="inline-block"
							>
								WandLabs
							</motion.span>
						</Link>
					</motion.div>

					{/* Desktop Menu Items */}
					<div
						className={`${bangers.className} hidden md:flex items-center space-x-6 lg:space-x-8 text-3xl`}
					>
						{/* Home */}
						<motion.div
							whileHover="hover"
							onHoverStart={() => setHoveredItem('home')}
							onHoverEnd={() => setHoveredItem(null)}
						>
							<Link
								href="/"
								className="font-bangers text-xl lg:text-2xl transform lg:skew-x-[-5deg] text-gray-900 hover:text-blue-600 transition-colors duration-300 block px-2 py-1"
								onClick={() => setActiveItem('home')}
							>
								<motion.span
									animate={shouldAnimate('home') ? blueGlowAnimation : {}}
									className="inline-block"
								>
									HOME
								</motion.span>
							</Link>
						</motion.div>

						{/* Services Dropdown - Click to open */}
						<div className="relative" ref={servicesRef}>
							<motion.div
								whileHover="hover"
								onHoverStart={() => setHoveredItem('services')}
								onHoverEnd={() => setHoveredItem(null)}
							>
								<button
									className={`flex items-center space-x-1 font-bangers text-xl lg:text-2xl transform lg:skew-x-[-5deg] text-gray-900 hover:text-blue-600 transition-colors duration-300 cursor-pointer px-2 py-1`}
									onClick={toggleServices}
								>
									<motion.span
										animate={shouldAnimate('services') ? blueGlowAnimation : {}}
										className="inline-block"
									>
										SERVICES
									</motion.span>
									<svg
										className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-300 ${
											isServicesOpen ? 'rotate-180' : ''
										}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
							</motion.div>

							<AnimatePresence>
								{isServicesOpen && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className="absolute left-0 mt-2 w-56 rounded-xl shadow-xl overflow-hidden bg-white border border-gray-100"
									>
										<div className="py-2">
											{servicesItems.map((service) => (
												<Link
													key={service.name}
													href={service.href}
													className="block px-4 py-3 text-sm lg:text-base text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-bangers tracking-wide relative group"
													onClick={() => {
														setIsServicesOpen(false);
														setActiveItem('services');
													}}
												>
													<span className="relative z-10">{service.name}</span>
													<motion.div
														className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
														animate={{
															boxShadow: [
																'0 0 8px rgba(59,130,246,0.2)',
																'0 0 15px rgba(59,130,246,0.4)',
																'0 0 8px rgba(59,130,246,0.2)',
															],
														}}
														transition={{
															duration: 2,
															repeat: Infinity,
															ease: 'easeInOut' as const,
														}}
													/>
												</Link>
											))}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{/* Industries Dropdown - Click to open */}
						<div className="relative" ref={industriesRef}>
							<motion.div
								whileHover="hover"
								onHoverStart={() => setHoveredItem('industries')}
								onHoverEnd={() => setHoveredItem(null)}
							>
								<button
									className={`flex items-center space-x-1 font-bangers text-xl lg:text-2xl transform lg:skew-x-[-5deg] text-gray-900 hover:text-blue-600 transition-colors duration-300 cursor-pointer px-2 py-1`}
									onClick={toggleIndustries}
								>
									<motion.span
										animate={
											shouldAnimate('industries') ? blueGlowAnimation : {}
										}
										className="inline-block"
									>
										INDUSTRIES
									</motion.span>
									<svg
										className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-300 ${
											isIndustriesOpen ? 'rotate-180' : ''
										}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
							</motion.div>

							<AnimatePresence>
								{isIndustriesOpen && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className="absolute left-0 mt-2 w-72 rounded-xl shadow-xl overflow-hidden bg-white border border-gray-100"
									>
										<div className="p-2">
											<div className="space-y-1">
												{industriesItems.map((industry) => (
													<Link
														key={industry.id}
														href={industry.href}
														className="block px-4 py-3 text-sm lg:text-base text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-bangers tracking-wide relative group rounded-lg"
														onClick={() => {
															setIsIndustriesOpen(false);
															setActiveItem(industry.id);
														}}
													>
														<span className="relative z-10">
															{industry.name}
														</span>
														<motion.div
															className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
															animate={{
																boxShadow: [
																	'0 0 8px rgba(59,130,246,0.2)',
																	'0 0 15px rgba(59,130,246,0.4)',
																	'0 0 8px rgba(59,130,246,0.2)',
																],
															}}
															transition={{
																duration: 2,
																repeat: Infinity,
																ease: 'easeInOut' as const,
															}}
														/>
													</Link>
												))}
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{/* About Us */}
						<motion.div
							whileHover="hover"
							onHoverStart={() => setHoveredItem('about')}
							onHoverEnd={() => setHoveredItem(null)}
						>
							<Link
								href="/about"
								className="font-bangers text-xl lg:text-2xl transform lg:skew-x-[-5deg] text-gray-900 hover:text-blue-600 transition-colors duration-300 block px-2 py-1"
								onClick={() => setActiveItem('about')}
							>
								<motion.span
									animate={shouldAnimate('about') ? blueGlowAnimation : {}}
									className="inline-block"
								>
									ABOUT US
								</motion.span>
							</Link>
						</motion.div>

						{/* Contact Us */}
						<motion.div
							whileHover="hover"
							onHoverStart={() => setHoveredItem('contact')}
							onHoverEnd={() => setHoveredItem(null)}
						>
							<Link
								href="/contact"
								className="font-bangers text-xl lg:text-2xl transform lg:skew-x-[-5deg] text-gray-900 hover:text-blue-600 transition-colors duration-300 block px-2 py-1"
								onClick={() => setActiveItem('contact')}
							>
								<motion.span
									animate={shouldAnimate('contact') ? blueGlowAnimation : {}}
									className="inline-block"
								>
									CONTACT US
								</motion.span>
							</Link>
						</motion.div>
					</div>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden z-50 relative w-10 h-10 flex items-center justify-center focus:outline-none"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label="Toggle menu"
						onMouseEnter={() => setHoveredItem('mobile')}
						onMouseLeave={() => setHoveredItem(null)}
					>
						<div className="relative w-6 h-5">
							<motion.span
								animate={hoveredItem === 'mobile' ? blueGlowAnimation : {}}
								className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ${
									isMobileMenuOpen ? 'rotate-45 top-2' : 'top-0'
								} text-gray-900`}
							/>
							<motion.span
								animate={hoveredItem === 'mobile' ? blueGlowAnimation : {}}
								className={`absolute h-0.5 w-full bg-current top-2 transition-all duration-300 ${
									isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
								} text-gray-900`}
							/>
							<motion.span
								animate={hoveredItem === 'mobile' ? blueGlowAnimation : {}}
								className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ${
									isMobileMenuOpen ? '-rotate-45 top-2' : 'top-4'
								} text-gray-900`}
							/>
						</div>
					</button>
				</div>
			</motion.nav>

			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
							onClick={() => setIsMobileMenuOpen(false)}
						/>

						{/* Mobile Menu Panel */}
						<motion.div
							initial={{ x: '-100%' }}
							animate={{ x: 0 }}
							exit={{ x: '-100%' }}
							transition={{ type: 'spring', damping: 25, stiffness: 200 }}
							className="fixed top-0 left-0 w-4/5 max-w-sm h-screen bg-linear-to-b from-white to-gray-50 z-40 md:hidden shadow-2xl overflow-y-auto"
						>
							<div className="flex flex-col h-full pt-24 pb-8 px-8">
								<motion.div
									variants={containerVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
									className="flex flex-col space-y-6"
								>
									{/* Home */}
									<motion.div variants={itemVariants}>
										<Link
											href="/"
											className="font-bangers text-4xl text-gray-900 hover:text-blue-600 transition-all duration-200 block transform skew-x-[-5deg] relative group"
											onClick={() => {
												setIsMobileMenuOpen(false);
												setActiveItem('home');
											}}
										>
											HOME
											<motion.div
												className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100"
												animate={
													activeItem === 'home'
														? {
																scale: [1, 1.1, 1],
																opacity: [0.2, 0.5, 0.2],
															}
														: {}
												}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: ['easeInOut', 'easeInOut'], // Array for keyframe animation
												}}
											/>
										</Link>
									</motion.div>

									{/* Mobile Services with Submenu */}
									<motion.div variants={itemVariants} className="space-y-4">
										<button
											onClick={() => {
												setIsMobileServicesOpen(!isMobileServicesOpen);
												setActiveItem('services');
											}}
											className="font-bangers text-4xl text-gray-900 hover:text-blue-600 transition-all duration-200 flex items-center space-x-2 transform skew-x-[-5deg] w-full group relative"
										>
											<span>SERVICES</span>
											<svg
												className={`w-5 h-5 transition-transform duration-300 ${
													isMobileServicesOpen ? 'rotate-180' : ''
												} group-hover:text-blue-600`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
											<motion.div
												className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100"
												animate={
													activeItem === 'services'
														? {
																scale: [1, 1.1, 1],
																opacity: [0.2, 0.5, 0.2],
															}
														: {}
												}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: ['easeInOut', 'easeInOut'], // Array for keyframe animation
												}}
											/>
										</button>

										<AnimatePresence>
											{isMobileServicesOpen && (
												<motion.div
													variants={mobileServicesVariants}
													initial="hidden"
													animate="visible"
													exit="exit"
													className="overflow-hidden"
												>
													<div className="pl-4 space-y-3 border-l-2 border-blue-200">
														{servicesItems.map((service, index) => (
															<motion.div
																key={service.name}
																initial={{ x: -20, opacity: 0 }}
																animate={{ x: 0, opacity: 1 }}
																transition={{ delay: index * 0.1 }}
															>
																<Link
																	href={service.href}
																	className="font-bangers text-2xl text-gray-600 hover:text-blue-600 transition-all duration-200 block transform skew-x-[-5deg] relative group"
																	onClick={() => {
																		setIsMobileServicesOpen(false);
																		setIsMobileMenuOpen(false);
																	}}
																>
																	{service.name}
																	<motion.div
																		className="absolute inset-0 bg-blue-500/10 blur-md opacity-0 group-hover:opacity-100"
																		animate={{
																			scale: [1, 1.05, 1],
																		}}
																		transition={{
																			duration: 2,
																			repeat: Infinity,
																			ease: ['easeInOut', 'easeInOut'], // Array for keyframe animation
																		}}
																	/>
																</Link>
															</motion.div>
														))}
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>

									{/* Mobile Industries with Submenu */}
									<motion.div variants={itemVariants} className="space-y-4">
										<button
											onClick={() => {
												setIsMobileIndustriesOpen(!isMobileIndustriesOpen);
												setActiveItem('industries');
											}}
											className="font-bangers text-4xl text-gray-900 hover:text-blue-600 transition-all duration-200 flex items-center space-x-2 transform skew-x-[-5deg] w-full group relative"
										>
											<span>INDUSTRIES</span>
											<svg
												className={`w-5 h-5 transition-transform duration-300 ${
													isMobileIndustriesOpen ? 'rotate-180' : ''
												} group-hover:text-blue-600`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
											<motion.div
												className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100"
												animate={
													activeItem === 'industries'
														? {
																scale: [1, 1.1, 1],
																opacity: [0.2, 0.5, 0.2],
															}
														: {}
												}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: ['easeInOut', 'easeInOut'], // Array for keyframe animation
												}}
											/>
										</button>

										<AnimatePresence>
											{isMobileIndustriesOpen && (
												<motion.div
													variants={mobileServicesVariants}
													initial="hidden"
													animate="visible"
													exit="exit"
													className="overflow-hidden"
												>
													<div className="pl-4 space-y-3 border-l-2 border-blue-200">
														{industriesItems.map((industry, index) => (
															<motion.div
																key={industry.id}
																initial={{ x: -20, opacity: 0 }}
																animate={{ x: 0, opacity: 1 }}
																transition={{ delay: index * 0.1 }}
															>
																<Link
																	href={industry.href}
																	className="font-bangers text-2xl text-gray-600 hover:text-blue-600 transition-all duration-200 block transform skew-x-[-5deg] relative group"
																	onClick={() => {
																		setIsMobileIndustriesOpen(false);
																		setIsMobileMenuOpen(false);
																		setActiveItem(industry.id);
																	}}
																>
																	{industry.name}
																	<motion.div
																		className="absolute inset-0 bg-blue-500/10 blur-md opacity-0 group-hover:opacity-100"
																		animate={{
																			scale: [1, 1.05, 1],
																		}}
																		transition={{
																			duration: 2,
																			repeat: Infinity,
																			ease: ['easeInOut', 'easeInOut'], // Array for keyframe animation
																		}}
																	/>
																</Link>
															</motion.div>
														))}
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>

									{/* About Us */}
									<motion.div variants={itemVariants}>
										<Link
											href="/about"
											className="font-bangers text-4xl text-gray-900 hover:text-blue-600 transition-all duration-200 block transform skew-x-[-5deg] relative group"
											onClick={() => {
												setIsMobileMenuOpen(false);
												setActiveItem('about');
											}}
										>
											ABOUT US
											<motion.div
												className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100"
												animate={
													activeItem === 'about'
														? {
																scale: [1, 1.1, 1],
																opacity: [0.2, 0.5, 0.2],
															}
														: {}
												}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: ['easeInOut', 'easeInOut'], // Array for keyframe animation
												}}
											/>
										</Link>
									</motion.div>

									{/* Contact Us */}
									<motion.div variants={itemVariants}>
										<Link
											href="/contact"
											className="font-bangers text-4xl text-gray-900 hover:text-blue-600 transition-all duration-200 block transform skew-x-[-5deg] relative group"
											onClick={() => {
												setIsMobileMenuOpen(false);
												setActiveItem('contact');
											}}
										>
											CONTACT US
											<motion.div
												className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100"
												animate={
													activeItem === 'contact'
														? {
																scale: [1, 1.1, 1],
																opacity: [0.2, 0.5, 0.2],
															}
														: {}
												}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: ['easeInOut', 'easeInOut'], // Array for keyframe animation
												}}
											/>
										</Link>
									</motion.div>

									{/* Mobile Social/Info */}
									<motion.div variants={itemVariants} className="pt-8 mt-auto">
										<div className="h-px bg-linear-to-r from-transparent via-blue-300 to-transparent mb-6" />
										<p className="font-bangers text-lg text-gray-500 transform skew-x-[-5deg] mb-3">
											Follow Us
										</p>
										<div className="flex space-x-4">
											<Link
												href={socialLinks.facebook}
												target="_blank"
												rel="noopener noreferrer"
												className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
											>
												<FaFacebookF size={16} />
											</Link>
											<Link
												href={socialLinks.instagram}
												target="_blank"
												rel="noopener noreferrer"
												className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
											>
												<FaInstagram size={16} />
											</Link>
											<Link
												href={socialLinks.whatsapp}
												target="_blank"
												rel="noopener noreferrer"
												className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
											>
												<FaWhatsapp size={16} />
											</Link>
										</div>
									</motion.div>
								</motion.div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

export default Navbar;
