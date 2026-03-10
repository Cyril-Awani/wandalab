// components/ProjectModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	X,
	CheckCircle,
	ArrowLeft,
	ArrowRight,
	Send,
	Sparkles,
	Loader2,
	Clock,
	Layers,
	FileCode,
	Palette,
} from 'lucide-react';
import {
	estimatePriceWithAI,
	pricing,
	type AIEstimateResponse,
} from '@/lib/priceEstimator';

interface ProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const steps = [
	{ id: 1, name: 'Project Details' },
	{ id: 2, name: 'Wanda View' },
	{ id: 3, name: 'Review & Submit' },
];

const websiteTypes = [
	'Basic Website',
	'Business Website',
	'E-commerce Store',
	'Custom Web App',
	'AI Chatbot Package',
];

export default function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		websiteType: '',
		description: '',
	});

	const [submitted, setSubmitted] = useState(false);
	const [aiEstimate, setAiEstimate] = useState<AIEstimateResponse | null>(null);
	const [isEstimating, setIsEstimating] = useState(false);
	const [estimateError, setEstimateError] = useState<string | null>(null);

	const getAIEstimate = async () => {
		if (!formData.description || !formData.websiteType) {
			setEstimateError('Please provide a project description and website type');
			return;
		}

		setIsEstimating(true);
		setEstimateError(null);

		try {
			const estimate = await estimatePriceWithAI(
				formData.description,
				formData.websiteType,
			);
			setAiEstimate(estimate);
		} catch {
			setEstimateError('Wanda View estimation failed. Please try again.');
		} finally {
			setIsEstimating(false);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Clear Wanda View when inputs change
		if (name === 'websiteType' || name === 'description') {
			setAiEstimate(null);
		}
	};

	const handleSubmit = () => {
		if (!aiEstimate) return;

		// Build WhatsApp message with user input and Wanda recommendations
		const message = `*New Project Inquiry*

*Client Information:*
Name: ${formData.name}
Phone: ${formData.phone}
Website Type: ${formData.websiteType}

*Project Description:*
${formData.description}

*Wanda View Recommendations:*
Estimated Price: ${aiEstimate.formattedPrice}
Timeline: ${aiEstimate.timeline}
Complexity: ${aiEstimate.analysis.complexity_level}
Estimated Pages: ${aiEstimate.analysis.estimated_pages}
Design Complexity: ${aiEstimate.analysis.design_complexity}

*Detected Features:*
${aiEstimate.analysis.features.length > 0 ? aiEstimate.analysis.features.join(', ') : 'None specified'}

${aiEstimate.analysis.notes ? `*Notes:* ${aiEstimate.analysis.notes}` : ''}

*Package Includes:*
${pricing.packages
	.filter((p) => p.name === formData.websiteType)
	.map((pkg) => pkg.includes.join('\n'))
	.join('\n')}`;

		// WhatsApp business number (replace with your actual number)
		const whatsappNumber = '2348145983735'; // Replace with actual WhatsApp number
		const encodedMessage = encodeURIComponent(message);
		const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

		// Open WhatsApp in new tab
		window.open(whatsappUrl, '_blank');

		setSubmitted(true);
	};

	const nextStep = () => {
		if (currentStep < steps.length) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
			>
				{/* Header */}
				<div className="relative p-6 border-b border-gray-200">
					<h2 className="text-2xl font-bold">Start Your Project</h2>
					<button
						onClick={onClose}
						className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>

					{/* Progress Bar */}
					<div className="mt-4">
						<div className="flex justify-between mb-2">
							{steps.map((step) => (
								<div
									key={step.id}
									className={`text-sm font-medium ${
										step.id === currentStep
											? 'text-blue-600'
											: step.id < currentStep
												? 'text-green-600'
												: 'text-gray-400'
									}`}
								>
									{step.name}
								</div>
							))}
						</div>
						<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
							<motion.div
								className="h-full bg-linear-to-r from-blue-600 to-cyan-600"
								initial={{
									width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
								}}
								animate={{
									width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
								}}
								transition={{ duration: 0.3 }}
							/>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-280px)] min-h-75">
					<AnimatePresence mode="wait">
						{!submitted ? (
							<motion.div
								key={currentStep}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
							>
								{currentStep === 1 && (
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Your Name *
											</label>
											<input
												type="text"
												name="name"
												value={formData.name}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												placeholder="John Doe"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Phone Number *
											</label>
											<input
												type="tel"
												name="phone"
												value={formData.phone}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												placeholder="+234 123 456 7890"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Website Type *
											</label>
											<select
												name="websiteType"
												value={formData.websiteType}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											>
												<option value="">Select website type</option>
												{websiteTypes.map((type) => (
													<option key={type} value={type}>
														{type}
													</option>
												))}
											</select>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Project Description *
											</label>
											<textarea
												name="description"
												value={formData.description}
												onChange={handleInputChange}
												required
												rows={4}
												className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												placeholder="Tell us about your project... Include details about features, pages, integrations, and any specific requirements."
											/>
										</div>
									</div>
								)}

								{currentStep === 2 && (
									<div className="space-y-6">
										{/* WandaLab Quote Button */}
										<div>
											<button
												onClick={getAIEstimate}
												disabled={
													isEstimating ||
													!formData.description ||
													!formData.websiteType
												}
												className="w-full px-6 py-4 bg-gray-900 text-white rounded-xl font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
											>
												{isEstimating ? (
													<>
														<Loader2 className="w-5 h-5 animate-spin" />
														Analyzing your project...
													</>
												) : (
													<>
														<Sparkles className="w-5 h-5" />
														WandaLab Quote
													</>
												)}
											</button>
											{estimateError && (
												<p className="text-sm text-red-600 mt-2">
													{estimateError}
												</p>
											)}
										</div>

										{/* Wanda View Results */}
										{aiEstimate && (
											<motion.div
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												className="space-y-6"
											>
												{/* Price & Timeline Cards */}
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
													<div className="p-4 md:p-5 bg-gray-50 rounded-xl border border-gray-200">
														<p className="text-sm text-gray-500 mb-1">
															Estimated Price
														</p>
														<p className="text-xl md:text-2xl font-bold text-gray-900">
															{aiEstimate.formattedPrice}
														</p>
													</div>
													<div className="p-4 md:p-5 bg-gray-50 rounded-xl border border-gray-200">
														<p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
															<Clock className="w-3 h-3" />
															Timeline
														</p>
														<p className="text-xl md:text-2xl font-bold text-gray-900">
															{aiEstimate.timeline}
														</p>
													</div>
												</div>

												{/* Project Details */}
												<div className="p-4 md:p-5 bg-gray-50 rounded-xl border border-gray-200">
													<h4 className="font-medium text-gray-900 mb-4">
														Project Details
													</h4>
													<div className="grid grid-cols-3 gap-3">
														<div>
															<p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
																<Layers className="w-3 h-3" />
																Complexity
															</p>
															<p className="font-semibold text-gray-900 capitalize text-sm">
																{aiEstimate.analysis.complexity_level}
															</p>
														</div>
														<div>
															<p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
																<FileCode className="w-3 h-3" />
																Pages
															</p>
															<p className="font-semibold text-gray-900 text-sm">
																{aiEstimate.analysis.estimated_pages}
															</p>
														</div>
														<div>
															<p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
																<Palette className="w-3 h-3" />
																Design
															</p>
															<p className="font-semibold text-gray-900 capitalize text-sm">
																{aiEstimate.analysis.design_complexity}
															</p>
														</div>
													</div>
												</div>

												{/* Detected Features */}
												{aiEstimate.analysis.features.length > 0 && (
													<div className="p-4 md:p-5 bg-gray-50 rounded-xl border border-gray-200">
														<h4 className="font-medium text-gray-900 mb-3">
															Detected Features
														</h4>
														<div className="flex flex-wrap gap-2">
															{aiEstimate.analysis.features.map(
																(feature, idx) => (
																	<span
																		key={idx}
																		className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg border border-gray-300"
																	>
																		{feature}
																	</span>
																),
															)}
														</div>
													</div>
												)}

												{/* What's Included */}
												<div className="p-4 md:p-5 bg-gray-50 rounded-xl border border-gray-200">
													<h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
														<CheckCircle className="w-4 h-4 text-gray-700" />
														What's Included
													</h4>
													{pricing.packages
														.filter((p) => p.name === formData.websiteType)
														.map((pkg) => (
															<ul key={pkg.name} className="space-y-2">
																{pkg.includes.map((item, idx) => (
																	<li
																		key={idx}
																		className="flex items-start gap-2 text-sm text-gray-700"
																	>
																		<CheckCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
																		{item}
																	</li>
																))}
															</ul>
														))}
												</div>

												{aiEstimate.analysis.notes && (
													<p className="text-sm text-gray-500 italic px-1">
														{aiEstimate.analysis.notes}
													</p>
												)}
											</motion.div>
										)}
									</div>
								)}

								{currentStep === 3 && aiEstimate && (
									<div className="space-y-5">
										<h3 className="text-lg font-semibold text-gray-900">
											Review Your Project
										</h3>

										{/* User Information */}
										<div className="p-4 md:p-5 bg-gray-50 rounded-xl border border-gray-200">
											<h4 className="font-medium text-gray-900 mb-4">
												Your Information
											</h4>
											<div className="space-y-3">
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
													<div>
														<p className="text-xs text-gray-500 mb-0.5">Name</p>
														<p className="font-medium text-gray-900 text-sm">
															{formData.name}
														</p>
													</div>
													<div>
														<p className="text-xs text-gray-500 mb-0.5">
															Phone
														</p>
														<p className="font-medium text-gray-900 text-sm">
															{formData.phone}
														</p>
													</div>
												</div>
												<div>
													<p className="text-xs text-gray-500 mb-0.5">
														Website Type
													</p>
													<p className="font-medium text-gray-900 text-sm">
														{formData.websiteType}
													</p>
												</div>
												<div>
													<p className="text-xs text-gray-500 mb-0.5">
														Description
													</p>
													<p className="text-gray-700 text-sm leading-relaxed">
														{formData.description}
													</p>
												</div>
											</div>
										</div>

										{/* Wanda View */}
										<div className="p-4 md:p-5 bg-gray-900 rounded-xl text-white">
											<h4 className="font-medium flex items-center gap-2 mb-4">
												<Sparkles className="w-4 h-4" />
												Wanda View
											</h4>

											<div className="grid grid-cols-2 gap-3 mb-4">
												<div className="bg-white/10 p-3 rounded-lg">
													<p className="text-xs text-gray-300 mb-1">
														Estimated Price
													</p>
													<p className="text-lg md:text-xl font-bold">
														{aiEstimate.formattedPrice}
													</p>
												</div>
												<div className="bg-white/10 p-3 rounded-lg">
													<p className="text-xs text-gray-300 mb-1 flex items-center gap-1">
														<Clock className="w-3 h-3" />
														Timeline
													</p>
													<p className="text-lg md:text-xl font-bold">
														{aiEstimate.timeline}
													</p>
												</div>
											</div>

											<div className="grid grid-cols-3 gap-2 text-sm">
												<div className="bg-white/10 p-2.5 rounded-lg text-center">
													<p className="text-xs text-gray-300 mb-0.5">
														Complexity
													</p>
													<p className="font-semibold capitalize text-sm">
														{aiEstimate.analysis.complexity_level}
													</p>
												</div>
												<div className="bg-white/10 p-2.5 rounded-lg text-center">
													<p className="text-xs text-gray-300 mb-0.5">Pages</p>
													<p className="font-semibold text-sm">
														{aiEstimate.analysis.estimated_pages}
													</p>
												</div>
												<div className="bg-white/10 p-2.5 rounded-lg text-center">
													<p className="text-xs text-gray-300 mb-0.5">Design</p>
													<p className="font-semibold capitalize text-sm">
														{aiEstimate.analysis.design_complexity}
													</p>
												</div>
											</div>

											{aiEstimate.analysis.features.length > 0 && (
												<div className="mt-4 pt-3 border-t border-white/20">
													<p className="text-xs text-gray-300 mb-2">
														Detected Features
													</p>
													<div className="flex flex-wrap gap-1.5">
														{aiEstimate.analysis.features.map(
															(feature, idx) => (
																<span
																	key={idx}
																	className="px-2 py-1 bg-white/10 text-white text-xs rounded-md"
																>
																	{feature}
																</span>
															),
														)}
													</div>
												</div>
											)}
										</div>

										{/* What's Included */}
										<div className="p-4 md:p-5 bg-gray-50 rounded-xl border border-gray-200">
											<h4 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
												<CheckCircle className="w-4 h-4 text-gray-700" />
												What's Included
											</h4>
											{pricing.packages
												.filter((p) => p.name === formData.websiteType)
												.map((pkg) => (
													<ul key={pkg.name} className="space-y-2">
														{pkg.includes.map((item, idx) => (
															<li
																key={idx}
																className="flex items-start gap-2 text-sm text-gray-700"
															>
																<CheckCircle className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
																{item}
															</li>
														))}
													</ul>
												))}
										</div>

										{aiEstimate.analysis.notes && (
											<p className="text-sm text-gray-500 italic px-1">
												{aiEstimate.analysis.notes}
											</p>
										)}
									</div>
								)}
							</motion.div>
						) : (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="text-center py-12"
							>
								<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
									<CheckCircle className="w-10 h-10 text-green-600" />
								</div>
								<h3 className="text-2xl font-bold mb-2">Project Submitted!</h3>
								<p className="text-gray-600 mb-6">
									Thank you for your interest. We'll get back to you within 24
									hours.
								</p>
								<button
									onClick={onClose}
									className="px-6 py-3 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold"
								>
									Close
								</button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Footer */}
				{!submitted && (
					<div className="p-4 md:p-6 border-t border-gray-200 bg-white shrink-0">
						<div className="flex items-center justify-between gap-3">
							<button
								onClick={prevStep}
								disabled={currentStep === 1}
								className={`px-4 md:px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors ${
									currentStep === 1
										? 'text-gray-300 cursor-not-allowed'
										: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
								}`}
							>
								<ArrowLeft className="w-5 h-5" />
								<span className="hidden sm:inline">Previous</span>
							</button>

							{currentStep < steps.length ? (
								<button
									onClick={nextStep}
									disabled={
										(currentStep === 1 &&
											(!formData.name ||
												!formData.phone ||
												!formData.websiteType ||
												!formData.description)) ||
										(currentStep === 2 && !aiEstimate)
									}
									className="px-5 md:px-6 py-3 bg-gray-900 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
								>
									Next
									<ArrowRight className="w-5 h-5" />
								</button>
							) : (
								<button
									onClick={handleSubmit}
									disabled={!aiEstimate}
									className="px-5 md:px-6 py-3 bg-gray-900 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 hover:bg-gray-800 transition-colors"
								>
									<span className="hidden sm:inline">Send via</span> WhatsApp
									<Send className="w-5 h-5" />
								</button>
							)}
						</div>
					</div>
				)}
			</motion.div>
		</div>
	);
}
