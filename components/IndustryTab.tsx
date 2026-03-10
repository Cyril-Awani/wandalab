// IndustryTab.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export interface IndustryItemProps {
	id: number;
	name: string;
	description: string;
	image: string;
	category?: string;
	link?: string;
}

interface IndustryTabProps {
	title?: string;
	subtitle?: string;
	items: IndustryItemProps[];
	isLoading?: boolean;
	onItemClick?: (item: IndustryItemProps) => void;
}

export function IndustryTab({
	title = 'Solutions',
	subtitle,
	items,
	isLoading = false,
	onItemClick,
}: IndustryTabProps) {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
					<div
						key={i}
						className={`rounded-2xl h-64 bg-gray-200 animate-pulse ${
							i === 1 || i === 8 ? 'lg:col-span-2 lg:row-span-2 h-80' : ''
						}`}
					/>
				))}
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="text-center py-20">
				<h3 className="text-2xl font-bold mb-2">No solutions found</h3>
				<p className="text-gray-600">
					We couldn't find any matches. Try different keywords.
				</p>
			</div>
		);
	}

	// Function to determine bento grid classes based on index
	const getBentoClasses = (index: number) => {
		// Desktop bento layout (lg screens)
		const desktopClasses = {
			// Featured large cards
			0: 'lg:col-span-2 lg:row-span-2 h-96',
			3: 'lg:col-span-2 lg:row-span-2 h-96',
			6: 'lg:col-span-2 lg:row-span-2 h-96',
			// Medium cards
			1: 'lg:col-span-1 lg:row-span-1 h-64',
			2: 'lg:col-span-1 lg:row-span-1 h-64',
			4: 'lg:col-span-1 lg:row-span-1 h-64',
			5: 'lg:col-span-1 lg:row-span-1 h-64',
			7: 'lg:col-span-1 lg:row-span-1 h-64',
			// Wide cards
			8: 'lg:col-span-2 lg:row-span-1 h-64',
			9: 'lg:col-span-2 lg:row-span-1 h-64',
			10: 'lg:col-span-1 lg:row-span-1 h-64',
			11: 'lg:col-span-1 lg:row-span-1 h-64',
			12: 'lg:col-span-2 lg:row-span-1 h-64',
			13: 'lg:col-span-1 lg:row-span-1 h-64',
			14: 'lg:col-span-1 lg:row-span-1 h-64',
			15: 'lg:col-span-2 lg:row-span-1 h-64',
			16: 'lg:col-span-1 lg:row-span-1 h-64',
			17: 'lg:col-span-1 lg:row-span-1 h-64',
		};

		return (
			desktopClasses[index as keyof typeof desktopClasses] ||
			'lg:col-span-1 lg:row-span-1 h-64'
		);
	};

	return (
		<div>
			{/* Header */}
			{title && (
				<div className="mb-12">
					<h2 className="text-4xl font-bold mb-2">{title}</h2>
					{subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
				</div>
			)}

			{/* Bento Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
				{items.map((item, index) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05 }}
						className={`group relative rounded-2xl overflow-hidden cursor-pointer ${getBentoClasses(index)}`}
						onClick={() => onItemClick?.(item)}
					>
						{/* Image */}
						<Image
							src={item.image}
							alt={item.name}
							fill
							className="object-cover transition-all duration-500 blur-sm group-hover:blur-0 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>

						{/* Category Badge */}
						<div className="absolute top-4 left-4 z-10">
							<span className="bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-semibold tracking-wide">
								{item.category || 'CATEGORY'}
							</span>
						</div>

						{/* Hover Gradient */}
						<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

						{/* Company Name - Always visible on mobile, hover on desktop */}
						<div className="absolute bottom-4 left-4 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-6 lg:group-hover:translate-y-0 transition-all duration-500">
							<span className="bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full font-medium">
								{item.name}
							</span>
						</div>

						{/* Description - Only visible on hover for larger cards */}
						<div className="absolute inset-0 flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
							<p className="text-white text-center text-sm font-medium bg-black/60 backdrop-blur-sm p-3 rounded-xl">
								{item.description}
							</p>
						</div>

						{/* Visit Website Button */}
						{item.link && (
							<a
								href={item.link}
								target="_blank"
								rel="noopener noreferrer"
								className="absolute top-4 right-4 w-10 h-10 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-5 group-hover:translate-y-0 transition-all duration-500 hover:scale-105 hover:bg-indigo-700"
								onClick={(e) => e.stopPropagation()}
							>
								<span className="sr-only">Visit</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="w-4 h-4"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
									/>
								</svg>
							</a>
						)}
					</motion.div>
				))}
			</div>
		</div>
	);
}
