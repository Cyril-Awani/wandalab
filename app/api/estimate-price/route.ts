import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a senior web development project estimator for a professional web agency.

Your task is to analyze a client project request and extract structured information that will be used to calculate the project price.

The agency pricing ranges are:

Landing Page: ₦75,000 - ₦150,000
Business Website: ₦150,000 - ₦350,000
E-commerce Website: ₦350,000 - ₦850,000
Custom Web Application: ₦850,000 - ₦2,500,000+
AI Chatbot Integration: ₦250,000 - ₦500,000

Your job is NOT to randomly guess a price.  
Instead analyze the project and determine the technical requirements and complexity.

Analyze the project based on the following signals:

Website Type
Landing page
Business website
E-commerce store
Custom web application
AI chatbot integration
Portfolio site
Blog site
Marketplace
SaaS platform

Project Scope
Estimated number of pages
Number of user roles
Admin dashboard needed
Content management system
Blog system

Features
Animations
Advanced UI interactions
Authentication system
User accounts
Payment gateway
Shopping cart
Product management
Search functionality
Notifications
Messaging or chat
File uploads
Analytics dashboard

Technical Requirements
Database required
API integrations
Third-party integrations
Custom backend
Real-time functionality
AI integration
External services

Design Complexity
Basic layout
Moderate custom design
Highly custom UI
Complex animations
Interactive UI

Infrastructure
Hosting setup
Database hosting
Cloud storage
CDN
Security setup

Timeline
Normal timeline
Fast delivery
Urgent delivery

Maintenance Needs
Future scalability
Admin controls
Long-term maintenance
SEO optimization

Based on the project description, return a JSON response with the following structure:

{
  "website_type": "",
  "complexity_level": "low | medium | high | very_high",
  "estimated_pages": number,
  "features": [],
  "integrations": [],
  "design_complexity": "basic | custom | advanced",
  "backend_required": true/false,
  "database_required": true/false,
  "animations_required": true/false,
  "cms_required": true/false,
  "authentication_required": true/false,
  "payment_required": true/false,
  "admin_dashboard": true/false,
  "hosting_setup": true/false,
  "timeline": "normal | fast | urgent",
  "complexity_score": number from 1-100,
  "notes": "brief explanation of the technical requirements"
}

Only return JSON.
Do not include explanations outside the JSON.`;

interface AIAnalysis {
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

interface PriceEstimate {
	minPrice: number;
	maxPrice: number;
	formattedPrice: string;
	timeline: string;
	analysis: AIAnalysis;
}

function calculatePriceFromAnalysis(analysis: AIAnalysis): PriceEstimate {
	// Base prices by website type
	const basePrices: Record<string, { min: number; max: number }> = {
		'landing page': { min: 75000, max: 150000 },
		'business website': { min: 150000, max: 350000 },
		'e-commerce': { min: 350000, max: 850000 },
		'custom web application': { min: 850000, max: 2500000 },
		'ai chatbot': { min: 250000, max: 500000 },
		portfolio: { min: 75000, max: 200000 },
		blog: { min: 100000, max: 250000 },
		marketplace: { min: 500000, max: 1500000 },
		saas: { min: 1000000, max: 3000000 },
	};

	// Find matching base price
	const typeKey = Object.keys(basePrices).find((key) =>
		analysis.website_type.toLowerCase().includes(key),
	);
	let { min, max } = typeKey
		? basePrices[typeKey]
		: { min: 150000, max: 500000 };

	// Adjust based on complexity score (1-100)
	const complexityMultiplier = 1 + (analysis.complexity_score - 50) / 100;
	min = Math.round(min * complexityMultiplier);
	max = Math.round(max * complexityMultiplier);

	// Feature adjustments
	const featurePrice = analysis.features.length * 15000;
	const integrationPrice = analysis.integrations.length * 25000;

	// Boolean feature adjustments
	if (analysis.backend_required) {
		min += 50000;
		max += 100000;
	}
	if (analysis.database_required) {
		min += 30000;
		max += 75000;
	}
	if (analysis.authentication_required) {
		min += 40000;
		max += 80000;
	}
	if (analysis.payment_required) {
		min += 50000;
		max += 120000;
	}
	if (analysis.admin_dashboard) {
		min += 75000;
		max += 150000;
	}
	if (analysis.cms_required) {
		min += 40000;
		max += 100000;
	}
	if (analysis.animations_required) {
		min += 25000;
		max += 60000;
	}

	// Design complexity adjustment
	if (analysis.design_complexity === 'custom') {
		min = Math.round(min * 1.2);
		max = Math.round(max * 1.2);
	} else if (analysis.design_complexity === 'advanced') {
		min = Math.round(min * 1.4);
		max = Math.round(max * 1.4);
	}

	// Timeline adjustment
	let timelineMultiplier = 1;
	if (analysis.timeline === 'fast') {
		timelineMultiplier = 1.25;
	} else if (analysis.timeline === 'urgent') {
		timelineMultiplier = 1.5;
	}

	min = Math.round(
		(min + featurePrice + integrationPrice) * timelineMultiplier,
	);
	max = Math.round(
		(max + featurePrice + integrationPrice) * timelineMultiplier,
	);

	// Calculate timeline estimate
	const baseWeeks = Math.ceil(analysis.estimated_pages / 2) + 1;
	const complexityWeeks = Math.ceil(analysis.complexity_score / 25);
	const totalWeeks = baseWeeks + complexityWeeks;
	const timelineEstimate =
		totalWeeks <= 2
			? '1-2 weeks'
			: totalWeeks <= 4
				? '2-4 weeks'
				: totalWeeks <= 8
					? '4-8 weeks'
					: '8-12 weeks';

	// Format price
	const formatPrice = (price: number): string => {
		if (price >= 1000000) {
			return `₦${(price / 1000000).toFixed(1)}M`;
		}
		return `₦${price.toLocaleString()}`;
	};

	return {
		minPrice: min,
		maxPrice: max,
		formattedPrice: `${formatPrice(min)} - ${formatPrice(max)}`,
		timeline: timelineEstimate,
		analysis,
	};
}

export async function POST(request: Request) {
	try {
		const { description, websiteType } = await request.json();

		if (!description) {
			return NextResponse.json(
				{ error: 'Project description is required' },
				{ status: 400 },
			);
		}

		const apiKey = process.env.GROQ_API_KEY;
		if (!apiKey) {
			return NextResponse.json(
				{ error: 'GROQ_API_KEY is not configured' },
				{ status: 500 },
			);
		}

		const userPrompt = `Client project description:

Website Type: ${websiteType || 'Not specified'}

Project Details:
${description}`;

		// Call Groq API directly via fetch
		const response = await fetch(
			'https://api.groq.com/openai/v1/chat/completions',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify({
					model: 'llama-3.3-70b-versatile',
					messages: [
						{ role: 'system', content: SYSTEM_PROMPT },
						{ role: 'user', content: userPrompt },
					],
					temperature: 0.3,
					max_tokens: 1024,
					response_format: { type: 'json_object' },
				}),
			},
		);

		if (!response.ok) {
			const errorData = await response.text();
			console.error('Groq API error:', errorData);
			return NextResponse.json(
				{ error: 'Failed to analyze project' },
				{ status: 500 },
			);
		}

		const data = await response.json();
		const content = data.choices?.[0]?.message?.content;

		if (!content) {
			return NextResponse.json(
				{ error: 'No response from AI' },
				{ status: 500 },
			);
		}

		const analysis: AIAnalysis = JSON.parse(content);
		const estimate = calculatePriceFromAnalysis(analysis);

		return NextResponse.json(estimate);
	} catch (error) {
		console.error('Error estimating price:', error);
		return NextResponse.json(
			{ error: 'Failed to estimate price' },
			{ status: 500 },
		);
	}
}
