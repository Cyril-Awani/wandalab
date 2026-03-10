'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
	const [showBanner, setShowBanner] = useState(false);

	useEffect(() => {
		const accepted = localStorage.getItem('cookiesAccepted');
		if (!accepted) setShowBanner(true);
	}, []);

	const acceptCookies = () => {
		localStorage.setItem('cookiesAccepted', 'true');
		setShowBanner(false);
	};

	const declineCookies = () => {
		console.log('User politely declined cookies 🍪🙃');
		setShowBanner(false);
	};

	return (
		<AnimatePresence>
			{showBanner && (
				<motion.div
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 100, opacity: 0 }}
					transition={{ type: 'spring', stiffness: 300, damping: 30 }}
					className="fixed z-50 
						/* Desktop: bottom left - wider container */
						md:bottom-4 md:left-4 md:right-auto md:translate-x-0 md:w-140 md:max-w-none
						/* Mobile: full width, centered */
						bottom-0 left-0 right-0 w-full px-4 pb-4
					"
				>
					<div
						className="
						/* Base styles - matching hero gradient */
						bg-white/90 backdrop-blur-xl 
						border border-blue-200/50 dark:border-purple-700 
						rounded-xl shadow-2xl p-5
						/* Flex layout */
						flex flex-col md:flex-row items-center gap-4
						
						
					"
					>
						<div className="flex-1 text-left">
							<p className="text-sm text-gray-700 dark:text-gray-100 font-medium">
								<span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
									Hey there!
								</span>
								{` We use cookies to make your experience sweeter. Mind if we `}
								<br className="hidden md:block" />
								<span className="md:inline">{` save some for later? 🍪`}</span>
							</p>
						</div>

						<div className="flex gap-3 shrink-0">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={declineCookies}
								className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full font-semibold text-sm hover:bg-gray-200 transition-colors whitespace-nowrap"
							>
								Decline
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={acceptCookies}
								className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow whitespace-nowrap"
							>
								Accept Cookies
							</motion.button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
