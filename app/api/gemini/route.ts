// app/api/gemini/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { companyInfo } from '@/config/company';

// Define types for better type safety
interface ServiceOption {
	name: string;
	price: string;
	timeline: string;
	features?: string[];
}

interface Service {
	name: string;
	description: string;
	startingPrice: string;
	timeline: string;
	options?: ServiceOption[];
}

// Knowledge base for RAG
interface KnowledgeItem {
	id: string;
	category:
		| 'service'
		| 'industry'
		| 'project'
		| 'pricing'
		| 'package'
		| 'faq'
		| 'process'
		| 'contact';
	title: string;
	content: string;
	keywords: string[];
	metadata?: any;
}

class RAGSystem {
	private knowledgeBase: KnowledgeItem[] = [];

	constructor() {
		this.buildKnowledgeBase();
	}

	private buildKnowledgeBase() {
		const services = companyInfo.services as Service[];

		// Add services to knowledge base
		services.forEach((service, index) => {
			// Main service
			this.knowledgeBase.push({
				id: `service-${index}`,
				category: 'service',
				title: service.name,
				content: `${service.name}: ${service.description}. Starting at ${service.startingPrice}. Timeline: ${service.timeline}`,
				keywords: [
					service.name.toLowerCase(),
					...service.name.split(' ').map((w) => w.toLowerCase()),
					'service',
					'offer',
				],
				metadata: {
					startingPrice: service.startingPrice,
					timeline: service.timeline,
				},
			});

			// Service options
			if (service.options) {
				service.options.forEach((option, optIndex) => {
					this.knowledgeBase.push({
						id: `service-${index}-option-${optIndex}`,
						category: 'service',
						title: `${service.name} - ${option.name}`,
						content: `${option.name}: ${option.price} (${option.timeline})${option.features ? '. Features: ' + option.features.join(', ') : ''}`,
						keywords: [
							option.name.toLowerCase(),
							...option.name.split(' ').map((w) => w.toLowerCase()),
							service.name.toLowerCase(),
						],
						metadata: {
							price: option.price,
							timeline: option.timeline,
							features: option.features,
						},
					});
				});
			}
		});

		// Add industries
		companyInfo.industries.forEach((industry, index) => {
			this.knowledgeBase.push({
				id: `industry-${index}`,
				category: 'industry',
				title: industry.name,
				content: `${industry.name}: ${industry.experience} experience. Projects: ${industry.projects.join(', ')}`,
				keywords: [
					industry.name.toLowerCase(),
					...industry.name.split(' ').map((w) => w.toLowerCase()),
					'industry',
					'sector',
					'experience',
				],
				metadata: {
					experience: industry.experience,
					projects: industry.projects,
				},
			});
		});

		// Add past projects
		companyInfo.pastProjects.forEach((project, index) => {
			this.knowledgeBase.push({
				id: `project-${index}`,
				category: 'project',
				title: project.name,
				content: `${project.name} for ${project.client}: ${project.description}. Timeline: ${project.timeline}. Tech: ${project.technologies.join(', ')}`,
				keywords: [
					project.name.toLowerCase(),
					project.client.toLowerCase(),
					...project.technologies.map((t) => t.toLowerCase()),
					'project',
					'portfolio',
				],
				metadata: {
					client: project.client,
					timeline: project.timeline,
					technologies: project.technologies,
				},
			});
		});

		// Add pricing info
		this.knowledgeBase.push({
			id: 'pricing-general',
			category: 'pricing',
			title: 'General Pricing',
			content: `Consultation: ${companyInfo.pricing.consultation}. Project-based: ${companyInfo.pricing.projectBased}. Hourly: ${companyInfo.pricing.hourly}. Retainer: ${companyInfo.pricing.retainer}`,
			keywords: [
				'pricing',
				'price',
				'cost',
				'fee',
				'consultation',
				'hourly',
				'project',
				'retainer',
				'budget',
				'afford',
				'how much',
			],
			metadata: companyInfo.pricing,
		});

		// Add packages
		companyInfo.pricing.packages.forEach((pkg, index) => {
			const priceMatch = pkg.price.match(/₦(\d+)/);
			const priceValue = priceMatch ? parseInt(priceMatch[1]) : 0;

			this.knowledgeBase.push({
				id: `package-${index}`,
				category: 'package',
				title: pkg.name,
				content: `${pkg.name}: ${pkg.price}. Includes: ${pkg.includes.join(', ')}`,
				keywords: [pkg.name.toLowerCase(), 'package', 'bundle', 'deal'],
				metadata: { price: pkg.price, priceValue, includes: pkg.includes },
			});
		});

		// Add FAQs
		companyInfo.faq.forEach((faq, index) => {
			this.knowledgeBase.push({
				id: `faq-${index}`,
				category: 'faq',
				title: faq.question,
				content: `Q: ${faq.question}\nA: ${faq.answer}`,
				keywords: [
					...faq.question
						.toLowerCase()
						.split(' ')
						.filter((w) => w.length > 3),
					'faq',
					'question',
					'help',
				],
				metadata: { answer: faq.answer },
			});
		});

		// Add process steps
		Object.entries(companyInfo.process).forEach(([step, duration], index) => {
			this.knowledgeBase.push({
				id: `process-${index}`,
				category: 'process',
				title: step,
				content: `${step}: ${duration}`,
				keywords: [step.toLowerCase(), 'process', 'step', 'how it works'],
				metadata: { duration },
			});
		});

		// Add delivery timelines
		Object.entries(companyInfo.deliveryTimelines).forEach(
			([project, timeline], index) => {
				this.knowledgeBase.push({
					id: `timeline-${index}`,
					category: 'process',
					title: `${project} timeline`,
					content: `${project}: ${timeline}`,
					keywords: [project.toLowerCase(), 'timeline', 'delivery', 'how long'],
					metadata: { timeline },
				});
			},
		);

		// Add contact info
		this.knowledgeBase.push({
			id: 'contact',
			category: 'contact',
			title: 'Contact Information',
			content: `Email: ${companyInfo.contact.email}. Hours: ${companyInfo.contact.hours}. Website: ${companyInfo.contact.website}. WhatsApp available via chat button.`,
			keywords: [
				'contact',
				'email',
				'phone',
				'call',
				'reach',
				'hours',
				'website',
				'whatsapp',
			],
			metadata: companyInfo.contact,
		});

		// Budget-specific items
		this.knowledgeBase.push({
			id: 'budget-too-low',
			category: 'faq',
			title: 'Budget too low (under ₦15k)',
			content: 'Graphics design starts at ₦15k. What are you hoping to create?',
			keywords: [
				'too low',
				'small budget',
				'500',
				'1000',
				'2000',
				'5000',
				'10000',
				'under 15k',
				'low budget',
			],
			metadata: { minBudget: 15000 },
		});

		this.knowledgeBase.push({
			id: 'budget-low',
			category: 'faq',
			title: 'Limited budget (₦15k - ₦50k)',
			content: 'Graphics design or basic website. Which interests you?',
			keywords: [
				'limited budget',
				'15000',
				'20000',
				'25000',
				'30000',
				'40000',
				'50000',
			],
			metadata: { minBudget: 15000, maxBudget: 50000 },
		});

		this.knowledgeBase.push({
			id: 'budget-medium',
			category: 'faq',
			title: 'Good budget (₦50k - ₦500k)',
			content: 'Storefront websites and basic apps. What do you need?',
			keywords: [
				'good budget',
				'60000',
				'70000',
				'100000',
				'200000',
				'300000',
				'400000',
				'500000',
			],
			metadata: { minBudget: 50000, maxBudget: 500000 },
		});

		this.knowledgeBase.push({
			id: 'budget-high',
			category: 'faq',
			title: 'Premium budget (₦500k - ₦5M+)',
			content:
				'Custom apps, AI integration, enterprise solutions. Tell me your vision.',
			keywords: [
				'premium',
				'high budget',
				'600000',
				'1million',
				'2million',
				'5million',
				'enterprise',
			],
			metadata: { minBudget: 500000, maxBudget: 5000000 },
		});

		// Payment plans
		this.knowledgeBase.push({
			id: 'payment-plans',
			category: 'faq',
			title: 'Flexible payment plans',
			content: 'Yes, we offer flexible payment plans. Start with a deposit.',
			keywords: [
				'payment plan',
				'installment',
				'pay later',
				'deposit',
				'part payment',
				'flexible payment',
			],
		});

		// Complex needs
		this.knowledgeBase.push({
			id: 'complex-needs',
			category: 'faq',
			title: 'Complex or custom needs',
			content: 'Tell me more about what you want to build.',
			keywords: [
				'custom',
				'specific',
				'unique',
				'different',
				'special',
				'custom build',
				'enterprise',
			],
		});

		// Design consultation
		this.knowledgeBase.push({
			id: 'design-consultation',
			category: 'service',
			title: 'Design Consultation Services',
			content:
				'We offer UI/UX design, branding, graphics, and brand identity. What style are you going for?',
			keywords: [
				'design',
				'website design',
				'branding',
				'colors',
				'logo',
				'brand',
				'ui',
				'ux',
				'visual identity',
				'palette',
				'style',
				'look',
				'aesthetic',
			],
		});

		// Industry-specific design
		this.knowledgeBase.push({
			id: 'finance-design',
			category: 'industry',
			title: 'Finance & Banking Design',
			content:
				'For finance, we recommend designs that convey trust and professionalism. Deep blues, navy, white, gold.',
			keywords: [
				'bank',
				'finance',
				'fintech',
				'financial',
				'insurance',
				'investment',
				'design',
				'colors',
				'branding',
			],
		});

		this.knowledgeBase.push({
			id: 'ecommerce-design',
			category: 'industry',
			title: 'E-commerce Design',
			content:
				'For e-commerce, focus on usability and conversion. Vibrant accents, clean layouts.',
			keywords: [
				'ecommerce',
				'store',
				'shop',
				'retail',
				'product',
				'shopping',
				'design',
				'colors',
				'website',
			],
		});

		this.knowledgeBase.push({
			id: 'healthcare-design',
			category: 'industry',
			title: 'Healthcare Design',
			content:
				'Healthcare design needs trust and clarity. Healing blues, calm greens, whites.',
			keywords: [
				'hospital',
				'clinic',
				'health',
				'medical',
				'healthcare',
				'doctor',
				'design',
				'colors',
				'branding',
			],
		});
	}

	private formatRange(min: number, max: number): string {
		if (max >= 1000000) {
			return `${(min / 1000000).toFixed(1)}M - ${(max / 1000000).toFixed(1)}M`;
		}
		if (max >= 1000) {
			return `${(min / 1000).toFixed(0)}k - ${(max / 1000).toFixed(0)}k`;
		}
		return `${min} - ${max}`;
	}

	private extractNumericValue(text: string): number | null {
		const cleanText = text.toLowerCase().replace(/\s+/g, ' ');

		if (cleanText.includes('5h') || cleanText.includes('5 h')) {
			return 5000;
		}

		const justNumberMatch = cleanText.match(/^₦?\s*(\d{1,3})$/);
		if (justNumberMatch) {
			const num = parseInt(justNumberMatch[1]);
			if (num < 1000) {
				return num;
			}
		}

		const patterns = [
			{ regex: /(\d+\.?\d*)\s*k/i, multiplier: 1000 },
			{ regex: /(\d+\.?\d*)\s*k(?!g)/i, multiplier: 1000 },
			{ regex: /(\d+\.?\d*)\s*thousand/i, multiplier: 1000 },
			{ regex: /(\d+\.?\d*)\s*m(?!g)/i, multiplier: 1000000 },
			{ regex: /(\d+\.?\d*)\s*million/i, multiplier: 1000000 },
			{ regex: /(\d+\.?\d*)\s*b/i, multiplier: 1000000000 },
			{ regex: /(\d+\.?\d*)\s*billion/i, multiplier: 1000000000 },
			{ regex: /(\d{1,3}(?:,\d{3})+)/, multiplier: 1, removeCommas: true },
			{ regex: /₦?\s*(\d+)/, multiplier: 1 },
		];

		for (const pattern of patterns) {
			const match = cleanText.match(pattern.regex);
			if (match) {
				let value = pattern.removeCommas
					? parseFloat(match[1].replace(/,/g, ''))
					: parseFloat(match[1]);

				return Math.round(value * pattern.multiplier);
			}
		}

		return null;
	}

	private getBudgetCategory(amount: number): string {
		if (amount < 15000) return 'too-low';
		if (amount < 50000) return 'low';
		if (amount < 500000) return 'medium';
		if (amount < 5000000) return 'high';
		return 'enterprise';
	}

	retrieveRelevantContext(query: string, maxResults: number = 4): string {
		const queryLower = query.toLowerCase();
		const queryWords = queryLower.split(' ').filter((w) => w.length > 2);

		const budgetValue = this.extractNumericValue(query);
		console.log(
			'💰 Detected budget:',
			budgetValue ? `₦${budgetValue.toLocaleString()}` : 'none',
		);

		const scored = this.knowledgeBase.map((item) => {
			let score = 0;

			if (item.title.toLowerCase().includes(queryLower)) {
				score += 5;
			}

			queryWords.forEach((word) => {
				if (item.keywords.some((k) => k.includes(word) || word.includes(k))) {
					score += 2;
				}
				if (item.content.toLowerCase().includes(word)) {
					score += 1;
				}
			});

			if (budgetValue !== null) {
				const budgetCategory = this.getBudgetCategory(budgetValue);

				if (item.id.includes('budget-' + budgetCategory)) {
					score += 15;
				} else if (item.id.includes('budget-')) {
					if (
						item.metadata?.minBudget &&
						budgetValue >= item.metadata.minBudget
					) {
						score += 8;
					}
				}

				if (budgetCategory === 'too-low' || budgetCategory === 'low') {
					if (item.id === 'payment-plans') {
						score += 12;
					}
				}

				if (item.metadata?.priceValue) {
					const packagePrice = item.metadata.priceValue;
					if (packagePrice <= budgetValue) {
						score += 10;
					} else if (packagePrice <= budgetValue * 1.3) {
						score += 5;
					}
				}

				if (item.metadata?.startingPrice) {
					const startingPriceMatch =
						item.metadata.startingPrice.match(/₦(\d+)/);
					if (startingPriceMatch) {
						const startingPrice = parseInt(startingPriceMatch[1]);
						if (startingPrice <= budgetValue) {
							score += 8;
						}
					}
				}
			}

			if (
				queryLower.includes('cost') ||
				queryLower.includes('price') ||
				queryLower.includes('how much') ||
				queryLower.includes('budget') ||
				queryLower.includes('afford')
			) {
				if (item.category === 'pricing' || item.category === 'package') {
					score += 3;
				}
			}

			if (
				queryLower.includes('how long') ||
				queryLower.includes('timeline') ||
				queryLower.includes('time') ||
				queryLower.includes('delivery')
			) {
				if (item.category === 'process' || item.metadata?.timeline) {
					score += 3;
				}
			}

			return { item, score };
		});

		const topResults = scored
			.filter((s) => s.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, maxResults)
			.map((s) => s.item.content);

		if (budgetValue !== null) {
			const budgetCategory = this.getBudgetCategory(budgetValue);
			const formattedBudget = `₦${budgetValue.toLocaleString()}`;

			switch (budgetCategory) {
				case 'too-low':
					topResults.push(`Graphics design starts at ₦15k. What do you need?`);
					break;
				case 'low':
					topResults.push(`Graphics or basic website. Which one?`);
					break;
				case 'medium':
					topResults.push(`Storefront websites or basic apps. What fits?`);
					break;
				case 'high':
					topResults.push(
						`Custom apps or AI integration. Tell me your vision.`,
					);
					break;
				case 'enterprise':
					topResults.push(`Enterprise solutions. Let's discuss your needs.`);
					break;
			}
		}

		return topResults.length > 0
			? `RELEVANT INFO:\n${topResults.join('\n\n')}`
			: '';
	}
}

const ragSystem = new RAGSystem();

const formatCompanyKnowledge = () => {
	const services = companyInfo.services as Service[];

	return `
COMPANY: ${companyInfo.name}
ABOUT: ${companyInfo.about}

SERVICES:
${services
	.map((s) => {
		return `- ${s.name}: ${s.startingPrice} | ${s.timeline}`;
	})
	.join('\n')}

PRICING:
- Consultation: ${companyInfo.pricing.consultation}
- Project-based: ${companyInfo.pricing.projectBased}
- Hourly: ${companyInfo.pricing.hourly}
- Retainer: ${companyInfo.pricing.retainer}

PACKAGES:
${companyInfo.pricing.packages.map((p) => `- ${p.name}: ${p.price}`).join('\n')}

CONTACT: Use WhatsApp button in chat
`;
};

// Short offline responses
const offlineSnippets = [
	'Connection issue. Use WhatsApp button below.',
	'Technical difficulty. WhatsApp button below works.',
	'Wanda offline. WhatsApp button below.',
];

const getRandomOfflineSnippet = () => {
	return offlineSnippets[Math.floor(Math.random() * offlineSnippets.length)];
};

async function callGroqAPI(model: string, messages: any[], apiKey: string) {
	const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

	const groqMessages = messages.map((msg) => {
		if (msg.role === 'system') {
			return { role: 'system', content: msg.content };
		}
		return {
			role: msg.role === 'assistant' ? 'assistant' : 'user',
			content: msg.content || '',
		};
	});

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 15000);

	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: model,
				messages: groqMessages,
				temperature: 0.3,
				max_tokens: 150,
				top_p: 0.9,
				stream: false,
			}),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Groq API error (${response.status}):`, errorText);

			if (response.status === 400) {
				try {
					const errorJson = JSON.parse(errorText);
					if (errorJson.error?.code === 'model_decommissioned') {
						throw new Error(`MODEL_DECOMMISSIONED: ${model}`);
					}
				} catch (e) {}
			}

			throw new Error(`Groq API responded with status ${response.status}`);
		}

		const data = await response.json();
		return data?.choices?.[0]?.message?.content;
	} catch (error: any) {
		clearTimeout(timeoutId);

		if (
			error.name === 'AbortError' ||
			error.code === 'UND_ERR_CONNECT_TIMEOUT'
		) {
			throw new Error('CONNECTION_TIMEOUT');
		}

		if (error.code === 'ENOTFOUND') {
			throw new Error('NETWORK_ERROR');
		}

		throw error;
	}
}

export async function POST(req: NextRequest) {
	try {
		const { message, history } = await req.json();

		const apiKey = process.env.GROQ_API_KEY;

		console.log('Wanda API Key Status:', apiKey ? 'Present' : 'Missing');

		if (!apiKey) {
			console.error('GROQ_API_KEY is not set');
			return NextResponse.json({
				reply: 'API key not configured.',
				showWhatsAppOption: true,
				isClosing: false,
			});
		}

		const relevantContext = ragSystem.retrieveRelevantContext(message, 3);
		const companyKnowledge = formatCompanyKnowledge();

		const lowerMessage = message.toLowerCase();

		const isClosingIntent =
			lowerMessage.includes('bye') || lowerMessage.includes('goodbye');

		// Check if we just asked about connecting
		const lastAssistantMessage = history
			?.slice()
			.reverse()
			.find((msg: any) => msg.role === 'assistant');
		const justAskedToConnect =
			lastAssistantMessage?.text
				?.toLowerCase()
				.includes('would you like to connect') ||
			lastAssistantMessage?.text
				?.toLowerCase()
				.includes('want me to connect you');

		// Human detection
		const wantsHuman =
			// Simple yes after connection offer
			(justAskedToConnect &&
				(lowerMessage === 'yes' ||
					lowerMessage === 'yeah' ||
					lowerMessage === 'yep' ||
					lowerMessage === 'sure')) ||
			// Direct requests
			lowerMessage.includes('talk to a human') ||
			lowerMessage.includes('speak to a human') ||
			lowerMessage.includes('talk to the boss') ||
			lowerMessage.includes('speak to the boss') ||
			lowerMessage.includes('i want to speak to someone') ||
			lowerMessage.includes('connect me to a human') ||
			lowerMessage.includes('i need a human') ||
			lowerMessage.includes('i need a real person') ||
			lowerMessage.includes('can i speak to a human') ||
			lowerMessage.includes('can i talk to a human') ||
			lowerMessage.includes('talk to your supervisor') ||
			lowerMessage.includes('speak to your supervisor') ||
			lowerMessage.includes('talk to your manager') ||
			lowerMessage.includes('speak to your manager') ||
			lowerMessage.includes('talk to your boss') ||
			lowerMessage.includes('speak to your boss') ||
			lowerMessage.includes('customer service') ||
			lowerMessage.includes('live agent') ||
			lowerMessage.includes('live person') ||
			lowerMessage.includes('real human') ||
			lowerMessage.includes('real person') ||
			lowerMessage.includes('live chat') ||
			lowerMessage.includes('chat with a human');

		if (isClosingIntent) {
			const closingMessages = ['Bye!', 'Thanks for chatting!', 'Goodbye!'];
			const randomClosing =
				closingMessages[Math.floor(Math.random() * closingMessages.length)];
			return NextResponse.json({
				reply: randomClosing,
				showWhatsAppOption: false,
				isClosing: false, // Never auto-close
			});
		}

		// If user wants human, trigger WhatsApp button
		if (wantsHuman) {
			return NextResponse.json({
				reply:
					"I'll connect you with our team. Click the WhatsApp button below.",
				showWhatsAppOption: true,
				isClosing: false, // Don't close the session
			});
		}

		// System prompt - concise and professional
		const systemPrompt = `
You are Wanda AI, a professional assistant for ${companyInfo.name}.

RULES:
- Be concise. 1-2 sentences.
- Professional tone, no emojis.
- When someone asks for help or seems interested, offer to connect them with the team.
- When offering connection, say something like "I can connect you with our team for more details. Would you like that?"
- No phone numbers - they should use WhatsApp button.

PRICING:
- Graphics: ₦15k+
- Websites: ₦75k+
- Apps: Custom pricing
- AI solutions: Custom pricing

${relevantContext || companyKnowledge}

Respond briefly and professionally. If the conversation indicates interest (questions about pricing, timelines, specific features), offer to connect them with the team.
`;

		const messages = [
			{ role: 'system', content: systemPrompt },
			...(history?.slice(-4).map((msg: any) => ({
				role: msg.role === 'user' ? 'user' : 'assistant',
				content: msg.text,
			})) || []),
			{ role: 'user', content: message },
		];

		let reply;
		let usedModel = '';

		const groqModels = [
			'llama-3.1-70b-versatile',
			'llama-3.1-8b-instant',
			'llama3-70b-8192',
			'llama3-8b-8192',
		];

		for (const model of groqModels) {
			try {
				console.log(`Attempting with Groq ${model}...`);
				reply = await callGroqAPI(model, messages, apiKey);
				usedModel = model;
				console.log(`✅ Success with Groq ${model}`);
				break;
			} catch (error: any) {
				console.log(`⚠️ Groq ${model} failed:`, error.message);
			}
		}

		if (!reply) {
			console.log('❌ All models failed - using fallback');
			return NextResponse.json({
				reply: getRandomOfflineSnippet(),
				showWhatsAppOption: true,
				isClosing: false,
			});
		}

		console.log(`Response generated using ${usedModel}`);

		// Check if the reply contains an offer to connect
		const lowerReply = reply.toLowerCase();
		const isOfferingConnection =
			lowerReply.includes('connect you') ||
			lowerReply.includes('connect with our team') ||
			lowerReply.includes('talk to our team') ||
			lowerReply.includes('speak with our team') ||
			lowerReply.includes('would you like') ||
			lowerReply.includes('want me to') ||
			lowerReply.includes('i can connect you');

		// Show WhatsApp button when offering connection or when user seems interested
		const showWhatsAppButton =
			isOfferingConnection ||
			lowerMessage.includes('how much') ||
			lowerMessage.includes('price') ||
			lowerMessage.includes('cost') ||
			lowerMessage.includes('interested') ||
			lowerMessage.includes('want to') ||
			lowerMessage.includes('need help');

		return NextResponse.json({
			reply: reply,
			showWhatsAppOption: showWhatsAppButton,
			isClosing: false, // Never auto-close
		});
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json({
			reply: 'Connection issue. Use WhatsApp button below.',
			showWhatsAppOption: true,
			isClosing: false,
		});
	}
}
