'use client';

import { Bangers } from 'next/font/google';
import {
	Mail,
	Phone,
	MapPin,
	Clock,
	Send,
	MessageSquare,
	Github,
	Twitter,
	Instagram,
	Linkedin,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const bangers = Bangers({
	weight: '400',
	subsets: ['latin'],
});

// Generate unique ID
function generateId() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		company: '',
		message: '',
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		'idle' | 'success' | 'error'
	>('idle');

	// Comprehensive visitor metadata
	const [visitorData, setVisitorData] = useState({
		// IP-based location
		ip: '',
		country: '',
		countryCode: '',
		region: '',
		city: '',
		timezone: '',
		isp: '',
		// Coordinates
		latitude: '',
		longitude: '',
		// Device info
		deviceType: '',
		browser: '',
		browserVersion: '',
		os: '',
		osVersion: '',
		screenResolution: '',
		language: '',
		// Additional
		referrer: '',
		pageUrl: '',
	});

	const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

	// Detect device type from user agent
	const getDeviceType = (ua: string): string => {
		if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
		if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua))
			return 'Mobile';
		return 'Desktop';
	};

	// Parse browser info from user agent
	const getBrowserInfo = (ua: string): { name: string; version: string } => {
		const browsers = [
			{ name: 'Edge', regex: /Edg\/(\d+[\d.]*)/ },
			{ name: 'Chrome', regex: /Chrome\/(\d+[\d.]*)/ },
			{ name: 'Firefox', regex: /Firefox\/(\d+[\d.]*)/ },
			{ name: 'Safari', regex: /Version\/(\d+[\d.]*).*Safari/ },
			{ name: 'Opera', regex: /OPR\/(\d+[\d.]*)/ },
			{ name: 'IE', regex: /MSIE (\d+[\d.]*)/ },
		];
		for (const browser of browsers) {
			const match = ua.match(browser.regex);
			if (match) return { name: browser.name, version: match[1] };
		}
		return { name: 'Unknown', version: '' };
	};

	// Parse OS info from user agent
	const getOSInfo = (ua: string): { name: string; version: string } => {
		const osPatterns = [
			{ name: 'Windows 11', regex: /Windows NT 10.0.*Win64/ },
			{ name: 'Windows 10', regex: /Windows NT 10.0/ },
			{ name: 'Windows 8.1', regex: /Windows NT 6.3/ },
			{ name: 'Windows 8', regex: /Windows NT 6.2/ },
			{ name: 'Windows 7', regex: /Windows NT 6.1/ },
			{ name: 'macOS', regex: /Mac OS X (\d+[._]\d+)/ },
			{ name: 'iOS', regex: /iPhone OS (\d+_\d+)/ },
			{ name: 'Android', regex: /Android (\d+[\d.]*)/ },
			{ name: 'Linux', regex: /Linux/ },
		];
		for (const os of osPatterns) {
			const match = ua.match(os.regex);
			if (match) {
				const version = match[1]?.replace(/_/g, '.') || '';
				return { name: os.name, version };
			}
		}
		return { name: 'Unknown', version: '' };
	};

	// Collect all visitor metadata on component mount
	useEffect(() => {
		const collectVisitorData = async () => {
			const ua = navigator.userAgent;
			const browserInfo = getBrowserInfo(ua);
			const osInfo = getOSInfo(ua);

			// Set device/browser info immediately
			setVisitorData((prev) => ({
				...prev,
				deviceType: getDeviceType(ua),
				browser: browserInfo.name,
				browserVersion: browserInfo.version,
				os: osInfo.name,
				osVersion: osInfo.version,
				screenResolution: `${window.screen.width}x${window.screen.height}`,
				language: navigator.language,
				referrer: document.referrer || 'Direct',
				pageUrl: window.location.href,
			}));

			// Fetch IP-based geolocation data (no permission needed)
			try {
				const response = await fetch('https://ipapi.co/json/');
				const data = await response.json();

				setVisitorData((prev) => ({
					...prev,
					ip: data.ip || '',
					country: data.country_name || '',
					countryCode: data.country_code || '',
					region: data.region || '',
					city: data.city || '',
					timezone: data.timezone || '',
					isp: data.org || '',
					latitude: data.latitude?.toString() || '',
					longitude: data.longitude?.toString() || '',
				}));
			} catch (error) {
				console.error('Failed to fetch IP data:', error);
			}
		};

		collectVisitorData();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!APPS_SCRIPT_URL) {
			alert('Contact form is not configured');
			return;
		}

		setIsSubmitting(true);
		setSubmitStatus('idle');

		try {
			// Prepare comprehensive submission data with all tracking fields
			const submissionData = {
				// Form data
				timestamp: new Date().toLocaleString(),
				name: formData.name,
				email: formData.email,
				phone: formData.phone || 'Not provided',
				company: formData.company || 'Not provided',
				message: formData.message,

				// IP-based location
				ip: visitorData.ip || 'Not available',
				country: visitorData.country || 'Not available',
				countryCode: visitorData.countryCode || '',
				region: visitorData.region || 'Not available',
				city: visitorData.city || 'Not available',
				timezone: visitorData.timezone || '',
				isp: visitorData.isp || '',
				latitude: visitorData.latitude || 'Not available',
				longitude: visitorData.longitude || 'Not available',

				// Device & Browser info
				deviceType: visitorData.deviceType || 'Unknown',
				browser: visitorData.browser || 'Unknown',
				browserVersion: visitorData.browserVersion || '',
				os: visitorData.os || 'Unknown',
				osVersion: visitorData.osVersion || '',
				screenResolution: visitorData.screenResolution || '',
				language: visitorData.language || '',

				// Additional tracking
				referrer: visitorData.referrer || 'Direct',
				pageUrl: visitorData.pageUrl || '',
				submissionId: generateId(),
			};

			// Make the fetch request with JSON body
			const response = await fetch(APPS_SCRIPT_URL, {
				method: 'POST',
				body: JSON.stringify(submissionData),
			});

			// Check if response is OK
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Parse the response
			const result = await response.json();
			console.log('Submission result:', result);

			if (result.success) {
				setSubmitStatus('success');
				setFormData({
					name: '',
					email: '',
					phone: '',
					company: '',
					message: '',
				});
				setTimeout(() => setSubmitStatus('idle'), 5000);
			} else {
				throw new Error(result.error || 'Submission failed');
			}
		} catch (error) {
			console.error('Submission error:', error);
			setSubmitStatus('error');
			setTimeout(() => setSubmitStatus('idle'), 5000);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const contactInfo = [
		{
			icon: <Mail className="w-6 h-6" />,
			title: 'Email',
			details: 'awanicyril@yahoo.com',
			link: 'mailto:awanicyril@yahoo.com',
		},
		{
			icon: <Phone className="w-6 h-6" />,
			title: 'Phone',
			details: '+234 814-598-3735',
			link: 'tel:+2348145983735',
		},
		{
			icon: <MapPin className="w-6 h-6" />,
			title: 'Location',
			details: 'Nigeria',
			link: 'https://maps.app.goo.gl/4Vk4f7D5hVAuoA9n9',
		},
		{
			icon: <Clock className="w-6 h-6" />,
			title: 'Hours',
			details: 'Mon-Fri: 9AM - 6PM WAT',
			link: null,
		},
	];

	const socialLinks = [
		{ icon: <Github className="w-5 h-5" />, href: '#', label: 'GitHub' },
		{ icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
		{ icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
		{ icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
	];

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="pt-32 pb-2 px-4">
				<div className="container mx-auto max-w-4xl text-center">
					<h1
						className={`${bangers.className} text-6xl md:text-7xl lg:text-8xl mb-6 tracking-wider transform skew-x-[-5deg]`}
					>
						<span className="bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
							Get in
						</span>
						<br />
						<span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
							Touch
						</span>
					</h1>

					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Have a project in mind? We'd love to hear about it. Send us a
						message and we'll respond within 24 hours.
					</p>
				</div>
			</section>

			{/* Contact Grid */}
			<section className="py-12 px-4">
				<div className="container mx-auto max-w-6xl">
					<div className="grid lg:grid-cols-3 gap-8">
						{/* Contact Info Cards */}
						<div className="lg:col-span-1 space-y-3">
							{contactInfo.map((item, index) => (
								<div
									key={index}
									className="bg-linear-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all"
								>
									<div className="flex items-start gap-3">
										<div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white shrink-0">
											{item.icon}
										</div>

										<div>
											<h3 className="font-semibold text-gray-900 mb-0.5">
												{item.title}
											</h3>

											{item.link ? (
												<a
													href={item.link}
													className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
												>
													{item.details}
												</a>
											) : (
												<p className="text-sm text-gray-600">{item.details}</p>
											)}
										</div>
									</div>
								</div>
							))}

							{/* Social Links */}
							<div className="bg-linear-to-br flex gap-2 items-center justify-between md:block from-gray-50 to-white p-3 rounded-xl border border-gray-200">
								<h3 className="font-semibold text-gray-900 md:mb-3">
									Follow Us
								</h3>

								<div className="flex gap-2">
									{socialLinks.map((social, index) => (
										<a
											key={index}
											href={social.href}
											className="w-9 h-9 bg-gray-200 hover:bg-linear-to-br hover:from-indigo-600 hover:to-purple-600 rounded-lg flex items-center justify-center text-gray-700 hover:text-white transition-all"
											aria-label={social.label}
										>
											{social.icon}
										</a>
									))}
								</div>
							</div>
						</div>

						{/* Contact Form */}
						<div className="lg:col-span-2">
							<div className="bg-white rounded-xl border border-gray-200 p-5 shadow-md">
								<div className="flex items-center gap-2 mb-4">
									<div className="w-9 h-9 bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
										<MessageSquare className="w-4 h-4" />
									</div>
									<h2 className="text-xl font-bold">Send us a Message</h2>
								</div>

								<form onSubmit={handleSubmit} className="space-y-4">
									<div className="grid md:grid-cols-2 gap-4">
										<div>
											<label
												htmlFor="name"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Your Name *
											</label>
											<input
												type="text"
												id="name"
												name="name"
												value={formData.name}
												onChange={handleChange}
												required
												className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
												placeholder="John Doe"
											/>
										</div>

										<div>
											<label
												htmlFor="email"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Email Address *
											</label>
											<input
												type="email"
												id="email"
												name="email"
												value={formData.email}
												onChange={handleChange}
												required
												className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
												placeholder="john@example.com"
											/>
										</div>
									</div>

									<div className="grid md:grid-cols-2 gap-4">
										<div>
											<label
												htmlFor="phone"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Phone Number (Optional)
											</label>
											<input
												type="tel"
												id="phone"
												name="phone"
												value={formData.phone}
												onChange={handleChange}
												className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
												placeholder="+1 (555) 123-4567"
											/>
										</div>

										<div>
											<label
												htmlFor="company"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Company (Optional)
											</label>
											<input
												type="text"
												id="company"
												name="company"
												value={formData.company}
												onChange={handleChange}
												className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors"
												placeholder="Your Company"
											/>
										</div>
									</div>

									<div>
										<label
											htmlFor="message"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Your Message *
										</label>
										<textarea
											id="message"
											name="message"
											value={formData.message}
											onChange={handleChange}
											required
											rows={4}
											className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors resize-none"
											placeholder="Tell us about your project..."
										/>
									</div>

									{submitStatus === 'success' && (
										<div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-lg text-sm">
											Thank you for reaching out! We'll get back to you soon.
										</div>
									)}

									{submitStatus === 'error' && (
										<div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
											Something went wrong. Please try again or email us
											directly.
										</div>
									)}

									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-md transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
									>
										{isSubmitting ? (
											'Sending...'
										) : (
											<>
												Send Message
												<Send className="w-4 h-4" />
											</>
										)}
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-20 px-4 bg-linear-to-br from-gray-50 to-white">
				<div className="container mx-auto max-w-4xl">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Frequently Asked{' '}
							<span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
								Questions
							</span>
						</h2>
						<p className="text-gray-600">
							Everything you need to know before reaching out
						</p>
					</div>

					<div className="space-y-4">
						{[
							{
								q: 'What services do you offer?',
								a: 'We offer web development, web design, digital marketing, and AI integration services.',
							},
							{
								q: 'How quickly do you respond to inquiries?',
								a: 'We typically respond within 24 hours during business days.',
							},
							{
								q: 'Do you work with international clients?',
								a: 'Yes! We work with clients from all around the world.',
							},
							{
								q: 'What is your typical project timeline?',
								a: 'Project timelines vary depending on scope, but we always provide clear estimates upfront.',
							},
						].map((faq, index) => (
							<div
								key={index}
								className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all"
							>
								<h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
								<p className="text-gray-600">{faq.a}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
