// industries/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Bangers } from 'next/font/google';
import { IndustryTab, IndustryItemProps } from '@/components/IndustryTab';

const bangers = Bangers({
	weight: '400',
	subsets: ['latin'],
});

const INDUSTRIES = [
	{ value: 'e-commerce', label: 'E-commerce' },
	{ value: 'hospitality-restaurants', label: 'Hospitality' },
	{ value: 'events-entertainment', label: 'Entertainment' },
];

const INDUSTRY_SOLUTIONS = {
	'e-commerce': [
		{
			id: 1,
			name: 'Fashion Retail Store',
			category: 'E-commerce',
			description:
				'Premium clothing marketplace with virtual try-on technology',
			image:
				'https://cdn.dribbble.com/userupload/44451350/file/1161892c7ff677bbcf381765daa353ce.png?resize=1024x768&vertical=center',
			link: '',
		},
		{
			id: 2,
			name: 'Electronics E-commerce',
			category: 'E-commerce',
			description: 'Tech products marketplace with AI-powered reviews',
			image:
				'https://cdn.dribbble.com/userupload/46431916/file/b24e36c86bd3745587a5bb363813b669.jpg?format=webp&resize=450x338&vertical=center',
			link: '',
		},
		{
			id: 3,
			name: 'Grocery Delivery Service',
			category: 'E-commerce',
			description: 'Online grocery shopping with scheduled delivery',
			image:
				'https://cdn.dribbble.com/userupload/43382123/file/original-45ff2edff5609d62681b9aa61c77c09e.jpg?format=webp&resize=450x338&vertical=center',
			link: '',
		},
		{
			id: 4,
			name: 'Mobile Shopping App',
			category: 'E-commerce',
			description: 'Native mobile commerce with AR product visualization',
			image:
				'https://cdn.dribbble.com/userupload/46981629/file/c9635e72a4fd2e13ff2207c439c3232c.png?format=webp&resize=450x338&vertical=center',
			link: '',
		},
		{
			id: 5,
			name: 'Luxury Marketplace',
			category: 'E-commerce',
			description: 'High-end products marketplace with authentication',
			image:
				'https://cdn.dribbble.com/userupload/45803160/file/3a3847887f439bf5c312091c1d4277b9.png?format=webp&resize=450x338&vertical=center',
			link: '',
		},
		{
			id: 6,
			name: 'B2B Wholesale Platform',
			category: 'E-commerce',
			description: 'B2B wholesale ordering and inventory management',
			image:
				'https://cdn.dribbble.com/userupload/46259978/file/b984d2302b241bfc429f350cdf45fa3c.png?format=webp&resize=450x338&vertical=center',
			link: '',
		},
	],
	'hospitality-restaurants': [
		{
			id: 7,
			name: 'Restaurant Management System',
			category: 'Hospitality',
			description: 'Complete POS and table management platform',
			image:
				'https://cdn.dribbble.com/userupload/30179108/file/original-77a2c4f2ce16257b9b2ddd7ba3220aeb.jpg?format=webp&resize=450x338&vertical=center',
			link: '/solutions/hospitality/restaurant',
		},
		{
			id: 8,
			name: 'Hotel Booking System',
			category: 'Hospitality',
			description: 'Accommodation management with channel manager',
			image:
				'https://cdn.dribbble.com/userupload/36539933/file/original-f29a4cac4aa3eb5a1cc4df7c9fd699a1.jpg?format=webp&resize=640x480&vertical=center',
			link: '',
		},
		{
			id: 9,
			name: 'Food Delivery Platform',
			category: 'Hospitality',
			description: 'Online food ordering with real-time tracking',
			image:
				'https://cdn.dribbble.com/userupload/16355180/file/original-9511c4d3d9ed456a7136f84c934f3fdc.jpg?format=webp&resize=450x338&vertical=center',
			link: '',
		},
		{
			id: 10,
			name: 'Table Reservation App',
			category: 'Hospitality',
			description: 'Smart dining reservation with waitlist management',
			image:
				'https://cdn.dribbble.com/userupload/32878250/file/original-854fdca49801cd5b8ba2a2fde3e2e5bf.png?format=webp&resize=450x338&vertical=center',
			link: '/solutions/hospitality/reservation',
		},
		{
			id: 11,
			name: 'Bar & Lounge Management',
			category: 'Hospitality',
			description: 'Specialized POS for bars and nightclubs',
			image:
				'https://cdn.dribbble.com/userupload/13617512/file/original-6dfc6ecd6b8fbc922cd9640b805d8054.jpg?crop=0x0-2000x1500&format=webp&resize=450x338&vertical=center',
			link: '/solutions/hospitality/bar',
		},
		{
			id: 12,
			name: 'Catering Service Platform',
			category: 'Hospitality',
			description: 'Event catering with menu planning and logistics',
			image:
				'https://cdn.dribbble.com/userupload/44208803/file/still-f26a7b48da120abea23f8698e2666778.png?format=webp&resize=640x480&vertical=center',
			link: '',
		},
	],
	'events-entertainment': [
		{
			id: 13,
			name: 'Event Ticketing Platform',
			category: 'Entertainment',
			description: 'Ticket sales with QR check-in system',
			image:
				'https://cdn.dribbble.com/userupload/5266867/file/original-7581ed97a845cb1f6cca228628ab8b56.png?crop=0x0-1366x1024&format=webp&resize=450x338&vertical=center',
			link: '',
		},
		{
			id: 14,
			name: 'Concert Venue Management',
			category: 'Entertainment',
			description: 'Venue booking and artist scheduling',
			image:
				'https://cdn.dribbble.com/userupload/42307529/file/original-027672f6fbc947c185f7485ee9894c36.jpg?format=webp&resize=450x338&vertical=center',
			link: '',
		},
		{
			id: 15,
			name: 'Festival Management App',
			category: 'Entertainment',
			description: 'Multi-stage event coordination',
			image:
				'https://cdn.dribbble.com/userupload/45973078/file/9a5e8966835f740940a62026f93265ba.png?format=webp&resize=450x338&vertical=center',
			link: '',
		},
		{
			id: 16,
			name: 'Virtual Events Platform',
			category: 'Entertainment',
			description: 'Hybrid and virtual event solution',
			image:
				'https://cdn.dribbble.com/userupload/5052926/file/original-b0076adef263b7c88b039e2a26799da8.png?format=webp&resize=640x480&vertical=center',
			link: '',
		},
		{
			id: 17,
			name: 'Sports League Management',
			category: 'Entertainment',
			description: 'League scheduling and fan engagement',
			image:
				'https://cdn.dribbble.com/userupload/43028767/file/original-550410cd3971d1e4721f2805251d4064.jpg?format=webp&resize=450x338&vertical=center',
			link: '',
		},
		{
			id: 18,
			name: 'Museum & Gallery System',
			category: 'Entertainment',
			description: 'Exhibition management and membership portal',
			image:
				'https://cdn.dribbble.com/userupload/21700287/file/original-63e6e9dfa8998629b7a26ecbdafe0dfe.png?format=webp&resize=450x338&vertical=center',
			link: '',
		},
	],
};

export default function IndustriesPage() {
	const searchParams = useSearchParams();
	const tabFromUrl = searchParams.get('tab') || 'e-commerce';
	const [activeTab, setActiveTab] = useState(tabFromUrl);

	useEffect(() => {
		setActiveTab(tabFromUrl);
	}, [tabFromUrl]);

	const solutions =
		INDUSTRY_SOLUTIONS[activeTab as keyof typeof INDUSTRY_SOLUTIONS] ||
		INDUSTRY_SOLUTIONS['e-commerce'];

	const handleItemClick = (item: IndustryItemProps) => {
		console.log('Item clicked:', item);
		if (item.link) {
			window.location.href = item.link;
		}
	};

	return (
		<div className="min-h-screen bg-white">
			{/* Header with Glass Morphism Effect */}
			<div className="pt-32 px-4 relative overflow-hidden bg-linear-to-b from-gray-50 to-white">
				<div className="mx-auto w-full max-w-3xl relative flex flex-col items-center justify-center text-center overflow-visible">
					<h1
						className={`${bangers.className} text-6xl md:text-7xl lg:text-8xl text-gray-900 tracking-wider transform skew-x-[-5deg]`}
					>
						Industry Solutions
					</h1>

					{/* Animated linear lines */}
					<div className="w-full relative flex flex-col items-center justify-center mt-4">
						<div className="absolute inset-x-auto top-0 bg-linear-to-r from-transparent via-indigo-500 to-transparent h-[0.5] w-full blur-sm"></div>
						<div className="absolute inset-x-auto top-0 bg-linear-to-r from-transparent via-indigo-500 to-transparent h-px w-full"></div>
						<div className="absolute inset-x-auto top-0 bg-linear-to-r from-transparent via-purple-400 to-transparent h-[1] w-1/2 blur-sm"></div>
						<div className="absolute inset-x-auto top-0 bg-linear-to-r from-transparent via-purple-400 to-transparent h-px w-1/2"></div>
					</div>

					<p className="mt-8 text-lg text-gray-600 max-w-2xl">
						Tailored solutions for every business type. Be part of millions of
						people around the world using our modern industry-specific
						solutions.
					</p>

					{/* Background glow effect */}
					<span className="absolute -z-1 backdrop-blur-sm inset-0 w-full h-full flex before:content-[''] before:h-3/4 before:w-full before:bg-linear-to-r before:from-black/5 before:to-purple-600/20 before:blur-[90px] after:content-[''] after:h-1/2 after:w-full after:bg-linear-to-br after:from-cyan-400/20 after:to-sky-300/20 after:blur-[90px]"></span>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-12">
				{/* Tabs */}
				<div className="mb-12">
					<div className="flex flex-wrap gap-3 justify-center">
						{INDUSTRIES.map((industry) => (
							<button
								key={industry.value}
								onClick={() => setActiveTab(industry.value)}
								className={`px-6 py-3 rounded-full font-medium transition-all ${
									activeTab === industry.value
										? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
								}`}
							>
								{industry.label}
							</button>
						))}
					</div>
				</div>

				{/* Industry Tab Component with Bento Grid */}
				<IndustryTab
					items={solutions}
					onItemClick={handleItemClick}
					title="" // Empty title since we already have the header
				/>
			</div>
		</div>
	);
}
