// lib/priceEstimator.ts
export interface ProjectDetails {
	websiteType: string;
	features?: string[];
	pages?: number;
	complexity?: 'low' | 'medium' | 'high';
	timeline?: string;
}

export interface AIAnalysis {
	website_type: string;
	complexity_level: 'low' | 'medium' | 'high' | 'very_high';
	estimated_pages: number;
	features: string[];
	integrations: string[];
	design_complexity: 'basic' | 'custom' | 'advanced';
	backend_required: boolean;
	database_required: boolean;
	animations_required: boolean;
	cms_required: boolean;
	authentication_required: boolean;
	payment_required: boolean;
	admin_dashboard: boolean;
	hosting_setup: boolean;
	timeline: 'normal' | 'fast' | 'urgent';
	complexity_score: number;
	notes: string;
}

export interface AIEstimateResponse {
	minPrice: number;
	maxPrice: number;
	formattedPrice: string;
	timeline: string;
	analysis: AIAnalysis;
}

export const pricing = {
	consultation: 'Free initial consultation',
	projectBased: 'Starting from ₦75,000 - ₦2,500,000+ depending on complexity',
	hourly: '₦5,000 - ₦15,000 per hour depending on expertise',
	retainer: 'Starting from ₦200,000/month for ongoing support',
	packages: [
		{
			name: 'Basic Website',
			price: '₦75,000 - ₦150,000',
			basePrice: 75000,
			maxPrice: 150000,
			includes: [
				'Single page/Landing page',
				'Animations',
				'Mobile responsive',
				'Contact form',
			],
		},
		{
			name: 'Business Website',
			price: '₦150,000 - ₦350,000',
			basePrice: 150000,
			maxPrice: 350000,
			includes: [
				'Up to 10 pages',
				'CMS integration',
				'Blog setup',
				'Basic SEO',
			],
		},
		{
			name: 'E-commerce Store',
			price: '₦350,000 - ₦850,000',
			basePrice: 350000,
			maxPrice: 850000,
			includes: [
				'Product management',
				'Payment gateway',
				'Inventory system',
				'Analytics',
			],
		},
		{
			name: 'Custom Web App',
			price: '₦850,000 - ₦2,500,000+',
			basePrice: 850000,
			maxPrice: 2500000,
			includes: [
				'Custom features',
				'Database design',
				'API integration',
				'Admin panel',
			],
		},
		{
			name: 'AI Chatbot Package',
			price: '₦250,000 - ₦500,000',
			basePrice: 250000,
			maxPrice: 500000,
			includes: [
				'Custom trained AI',
				'Website integration',
				'WhatsApp integration',
				'Analytics dashboard',
			],
		},
	],
};

// Fallback estimation when AI is not available
export function estimatePrice(details: ProjectDetails): string {
	const selectedPackage = pricing.packages.find((p) =>
		p.name.toLowerCase().includes(details.websiteType.toLowerCase()),
	);

	if (!selectedPackage) {
		return 'Contact us for a custom quote';
	}

	let estimatedPrice = selectedPackage.basePrice;

	// Adjust based on complexity
	if (details.complexity === 'high') {
		estimatedPrice = selectedPackage.maxPrice;
	} else if (details.complexity === 'medium') {
		estimatedPrice = Math.floor(
			(selectedPackage.basePrice + selectedPackage.maxPrice) / 2,
		);
	}

	// Adjust based on features
	if (details.features) {
		const additionalFeatures = details.features.length;
		estimatedPrice += additionalFeatures * 25000; // ₦25,000 per additional feature
	}

	// Format price
	if (estimatedPrice > 1000000) {
		return `₦${(estimatedPrice / 1000000).toFixed(1)}M - ₦${(selectedPackage.maxPrice / 1000000).toFixed(1)}M`;
	} else if (estimatedPrice > 1000) {
		return `₦${estimatedPrice.toLocaleString()} - ₦${selectedPackage.maxPrice.toLocaleString()}`;
	}

	return selectedPackage.price;
}

// AI-powered estimation using Groq
export async function estimatePriceWithAI(
	description: string,
	websiteType: string,
): Promise<AIEstimateResponse> {
	const response = await fetch('/api/estimate-price', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ description, websiteType }),
	});

	if (!response.ok) {
		throw new Error('Failed to estimate price');
	}

	return response.json();
}
