// components/ChatWidget.tsx
'use client';
import {
	useState,
	useEffect,
	useRef,
	useCallback,
	KeyboardEvent,
	ChangeEvent,
} from 'react';
import Image from 'next/image';
import { Bangers } from 'next/font/google';

// Initialize Bangers font
const bangers = Bangers({
	weight: '400',
	subsets: ['latin'],
	display: 'swap',
});

// Define message type
interface Message {
	role: 'user' | 'assistant';
	text: string;
	whatsapp?: boolean;
	isClosing?: boolean;
	isStreaming?: boolean;
	showDecisionButtons?: boolean;
	showContactForm?: boolean;
}

// Define API response type
interface ApiResponse {
	reply: string;
	showWhatsAppOption?: boolean;
	isClosing?: boolean;
}

// WhatsApp number constant
const WHATSAPP_NUMBER = '2348145983735';
const WHATSAPP_MESSAGE = encodeURIComponent(
	'Hello! I was just chatting with Wanda AI from WandLabs and would like to speak with a human.',
);

interface ContactFormState {
	name: string;
	phone: string;
	email: string;
}

export default function ChatWidget() {
	const [open, setOpen] = useState<boolean>(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [showSettings, setShowSettings] = useState<boolean>(false);
	const [streamSpeed, setStreamSpeed] = useState<number>(50);
	const [streamEnabled, setStreamEnabled] = useState<boolean>(true);
	const [showContactForm, setShowContactForm] = useState<boolean>(false);
	const [contactForm, setContactForm] = useState<ContactFormState>({
		name: '',
		phone: '',
		email: '',
	});
	const [userInfo, setUserInfo] = useState<ContactFormState | null>(null);
	const [conversationPhase, setConversationPhase] = useState<
		'greeting' | 'guiding' | 'asking_connect' | 'contact_form' | 'completed'
	>('greeting');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const settingsRef = useRef<HTMLDivElement>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const chatContainerRef = useRef<HTMLDivElement>(null);

	// Add welcome message when chat is first opened
	useEffect(() => {
		if (open && messages.length === 0) {
			const hour = new Date().getHours();
			let greeting = 'Hello';

			if (hour < 12) greeting = 'Good morning';
			else if (hour < 18) greeting = 'Good afternoon';
			else greeting = 'Good evening';

			const welcomeMessage: Message = {
				role: 'assistant',
				text: `${greeting}! I'm Wanda, your AI assistant from WandLabs. I'm here to help you find the perfect digital solution for your needs. What are you interested in? (e.g., website, mobile app, graphics design, AI tools, etc.)`,
				showDecisionButtons: false,
				showContactForm: false,
			};

			setMessages([welcomeMessage]);
			setConversationPhase('guiding');
		}
	}, [open, messages.length]);

	// Auto-scroll to bottom
	useEffect(() => {
		const timer = setTimeout(() => {
			if (messagesEndRef.current) {
				messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
			}
		}, 0);
		return () => clearTimeout(timer);
	}, [messages]);

	// Close settings when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				settingsRef.current &&
				!settingsRef.current.contains(event.target as Node)
			) {
				setShowSettings(false);
			}
		};

		if (showSettings) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}
	}, [showSettings]);

	// Close chat when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				chatContainerRef.current &&
				!chatContainerRef.current.contains(event.target as Node)
			) {
				const target = event.target as HTMLElement;
				if (!target.closest('button:has(svg), button:has(span)')) {
					setOpen(false);
				}
			}
		};

		if (open) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}
	}, [open]);

	// Clean up streaming on unmount
	useEffect(() => {
		return () => {
			if (streamIntervalRef.current) {
				clearTimeout(streamIntervalRef.current);
			}
		};
	}, []);

	// Skip streaming
	const skipStreaming = () => {
		if (streamIntervalRef.current) {
			clearTimeout(streamIntervalRef.current);
			streamIntervalRef.current = null;
		}

		setMessages((prev) => {
			const updated = [...prev];
			const lastIdx = updated.length - 1;
			if (lastIdx >= 0 && updated[lastIdx].isStreaming) {
				updated[lastIdx].isStreaming = false;
			}
			return updated;
		});
	};

	// Stream text character by character
	const streamText = (
		fullText: string,
		messageIndex: number,
		showButtons: boolean = false,
	) => {
		if (!streamEnabled) {
			setMessages((prev) => {
				const updated = [...prev];
				updated[messageIndex].text = fullText;
				updated[messageIndex].isStreaming = false;
				updated[messageIndex].showDecisionButtons = showButtons;
				return updated;
			});

			// Update conversation phase if showing buttons
			if (showButtons) {
				setConversationPhase('asking_connect');
			}
			return;
		}

		let charIndex = 0;
		const speed = 101 - streamSpeed;

		const stream = () => {
			if (charIndex < fullText.length) {
				charIndex++;
				setMessages((prev) => {
					const updated = [...prev];
					updated[messageIndex].text = fullText.slice(0, charIndex);
					updated[messageIndex].isStreaming = true;
					updated[messageIndex].showDecisionButtons = false;
					return updated;
				});

				streamIntervalRef.current = setTimeout(stream, speed);
			} else {
				// Streaming complete - now show buttons
				setMessages((prev) => {
					const updated = [...prev];
					updated[messageIndex].isStreaming = false;
					updated[messageIndex].showDecisionButtons = showButtons;
					return updated;
				});
				streamIntervalRef.current = null;

				// Update conversation phase when streaming completes
				if (showButtons) {
					setConversationPhase('asking_connect');
				}
			}
		};

		stream();
	};

	const sendMessage = useCallback(async (): Promise<void> => {
		if (!input.trim()) return;

		const userMessage: Message = {
			role: 'user',
			text: input,
			showDecisionButtons: false,
			showContactForm: false,
		};
		setMessages((prev) => [...prev, userMessage]);
		setInput('');
		setLoading(true);

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		try {
			console.log('Sending message:', input);
			console.log('History:', messages);

			const res = await fetch('/api/gemini', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					message: input,
					history: messages.map(({ role, text }) => ({
						role,
						text,
					})),
				}),
			});

			if (!res.ok) {
				const errorText = await res.text();
				console.error('API response not OK:', res.status, errorText);
				throw new Error(`API responded with status ${res.status}`);
			}

			const data: ApiResponse = await res.json();
			console.log('API response:', data);

			// IMPROVED: Determine if this message should show decision buttons
			// Check for human-like responses that indicate it's time to offer connection
			const lowerReply = data.reply.toLowerCase();
			const shouldShowDecisionButtons =
				!data.isClosing &&
				!data.showWhatsAppOption && // Not already showing WhatsApp
				conversationPhase === 'guiding' && // Still in guiding phase
				messages.length >= 3 && // After some conversation
				// Look for natural transition points in the AI's response
				(lowerReply.includes('how can i help') ||
					lowerReply.includes('what would you like') ||
					lowerReply.includes('tell me more') ||
					lowerReply.includes('what interests you') ||
					lowerReply.includes('which one') ||
					lowerReply.includes('perfect') ||
					lowerReply.includes('great') ||
					lowerReply.includes('excellent') ||
					lowerReply.includes('sounds good') ||
					messages.some(
						(m) =>
							m.role === 'user' &&
							(m.text.toLowerCase().includes('website') ||
								m.text.toLowerCase().includes('app') ||
								m.text.toLowerCase().includes('design') ||
								m.text.toLowerCase().includes('graphics') ||
								m.text.toLowerCase().includes('ai')),
					));

			const botMessage: Message = {
				role: 'assistant',
				text: '', // Start empty for streaming
				whatsapp: data.showWhatsAppOption || false,
				isClosing: data.isClosing,
				isStreaming: true,
				showDecisionButtons: false, // Start with false
				showContactForm: false,
			};

			setMessages((prev) => [...prev, botMessage]);

			// Start streaming the text
			const newMessageIndex = messages.length + 1;
			streamText(data.reply, newMessageIndex, shouldShowDecisionButtons);

			// If it's a closing message, auto-close chat after delay
			if (data.isClosing) {
				setTimeout(() => {
					setOpen(false);
					setTimeout(() => setMessages([]), 300);
				}, 5000);
			}
		} catch (error) {
			console.error('Chat error:', error);

			const errorMessage: Message = {
				role: 'assistant',
				text: '',
				whatsapp: true,
				isStreaming: true,
				showDecisionButtons: false,
				showContactForm: false,
			};

			setMessages((prev) => [...prev, errorMessage]);

			const newMessageIndex = messages.length + 1;
			const errorText =
				"I'm having trouble connecting. Click the WhatsApp button below to chat with us! 😊";
			streamText(errorText, newMessageIndex, false);
		} finally {
			setLoading(false);
		}
	}, [input, messages, streamSpeed, streamEnabled, conversationPhase]);

	const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
		setInput(e.target.value);
	};

	const handleCloseChat = useCallback((): void => {
		if (streamIntervalRef.current) {
			clearTimeout(streamIntervalRef.current);
		}
		setOpen(false);
		setTimeout(() => setMessages([]), 300);
	}, []);

	// Handle user wanting to connect
	const handleWantToConnect = () => {
		const confirmMessage: Message = {
			role: 'user',
			text: 'Yes, I would like to connect with your boss',
			showDecisionButtons: false,
			showContactForm: false,
		};
		setMessages((prev) => [...prev, confirmMessage]);

		// Show contact form after user message
		setTimeout(() => {
			setShowContactForm(true);
			setConversationPhase('contact_form');
		}, 300);
	};

	// Handle contact form submission
	const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!contactForm.name || !contactForm.phone) {
			alert('Please fill in name and phone number');
			return;
		}

		setUserInfo(contactForm);
		setShowContactForm(false);
		setLoading(true);

		try {
			await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: contactForm.name,
					phone: contactForm.phone,
					email: contactForm.email || undefined,
					timestamp: new Date().toISOString(),
				}),
			});

			const acknowledgeMessage: Message = {
				role: 'assistant',
				text: `Thank you, ${contactForm.name}! Your information has been saved. You may click the button below to connect with our team on WhatsApp.`,
				whatsapp: true,
				showDecisionButtons: false,
				showContactForm: false,
			};
			setMessages((prev) => [...prev, acknowledgeMessage]);
			setConversationPhase('completed');
		} catch (error) {
			console.error('Error saving to Google Sheets:', error);
			const fallbackMessage: Message = {
				role: 'assistant',
				text: `Thank you, ${contactForm.name}! You may click the button below to connect with our team on WhatsApp.`,
				whatsapp: true,
				showDecisionButtons: false,
				showContactForm: false,
			};
			setMessages((prev) => [...prev, fallbackMessage]);
			setConversationPhase('completed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{/* Floating Button */}
			<button
				onClick={() => setOpen(!open)}
				className="fixed bottom-5 right-5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg z-50 transition-all duration-300 hover:scale-110"
				aria-label="Toggle chat"
			>
				{open ? (
					'✕'
				) : (
					<div className="relative">
						💬
						<span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
					</div>
				)}
			</button>

			{/* Chat Window */}
			{open && (
				<div
					ref={chatContainerRef}
					className="fixed bottom-24 right-5 w-96 max-w-[calc(100vw-2rem)] h-150 max-h-[calc(100vh-8rem)] bg-white border border-gray-200 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5"
				>
					{/* Header */}
					<div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
								<span
									className={`${bangers.className} text-xl font-bold text-white skew-x-[-8deg]`}
								>
									W
								</span>
							</div>
							<div>
								<div className="flex items-center space-x-2">
									<h3 className={`${bangers.className} text-xl skew-x-[-8deg]`}>
										WANDA AI
									</h3>
									<span className="bg-green-400 text-xs text-white px-2 py-0.5 rounded-full">
										Online
									</span>
								</div>
								<p className="text-xs text-blue-100 font-poppins">
									WandLabs Digital Assistant
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<button
								onClick={() => setShowSettings(!showSettings)}
								className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded"
								aria-label="Settings"
							>
								⚙️
							</button>
							<button
								onClick={handleCloseChat}
								className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded"
								aria-label="Close chat"
							>
								✕
							</button>
						</div>
					</div>

					{/* Settings Panel */}
					{showSettings && (
						<div
							ref={settingsRef}
							className="bg-blue-50 border-b border-blue-100 p-4 space-y-3"
						>
							<div>
								<label className="flex items-center space-x-2 mb-2">
									<input
										type="checkbox"
										checked={streamEnabled}
										onChange={(e) => setStreamEnabled(e.target.checked)}
										className="w-4 h-4 text-blue-600 rounded"
									/>
									<span className="text-sm font-medium text-gray-700 font-poppins">
										Text Streaming
									</span>
								</label>
								<p className="text-xs text-gray-500 ml-6 font-poppins">
									Watch text appear as it's generated
								</p>
							</div>

							{streamEnabled && (
								<div>
									<div className="flex justify-between items-center mb-2">
										<label className="text-sm font-medium text-gray-700 font-poppins">
											Speed
										</label>
										<span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-poppins">
											{streamSpeed === 50
												? 'Normal'
												: streamSpeed > 50
													? 'Fast'
													: 'Slow'}
										</span>
									</div>
									<input
										type="range"
										min="1"
										max="100"
										value={streamSpeed}
										onChange={(e) => setStreamSpeed(parseInt(e.target.value))}
										className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
									/>
									<div className="flex justify-between text-xs text-gray-500 mt-1 font-poppins">
										<span>Slow</span>
										<span>Fast</span>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Messages */}
					<div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
						{messages.map((msg, i) => (
							<div
								key={i}
								className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
							>
								<div
									className={`max-w-[85%] p-3 rounded-lg ${
										msg.role === 'user'
											? 'bg-blue-600 text-white rounded-br-none'
											: 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
									} ${msg.isClosing ? 'border-l-4 border-l-green-500' : ''}`}
								>
									{/* Assistant message header */}
									{msg.role === 'assistant' && (
										<div className="flex items-center space-x-2 mb-1">
											<span
												className={`${bangers.className} text-sm text-blue-600 skew-x-[-8deg]`}
											>
												WANDA AI
											</span>
											{msg.isClosing && (
												<span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-poppins">
													Session ending
												</span>
											)}
										</div>
									)}

									<div className="flex justify-between items-start gap-2">
										<p className="text-sm whitespace-pre-wrap leading-relaxed flex-1 font-poppins">
											{msg.text}
											{msg.isStreaming && (
												<span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse"></span>
											)}
										</p>
										{msg.isStreaming && (
											<button
												onClick={skipStreaming}
												className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded whitespace-nowrap shrink-0 transition-colors font-poppins"
												title="Skip streaming"
											>
												Skip
											</button>
										)}
									</div>

									{/* Connection Decision Buttons - Only show after streaming completes */}
									{msg.role === 'assistant' &&
										!msg.isStreaming &&
										msg.showDecisionButtons && (
											<div className="mt-3 pt-2 border-t border-gray-200 space-y-2">
												<button
													onClick={handleWantToConnect}
													className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors font-poppins"
												>
													Yes, I would like to connect with your team
												</button>
												<button
													onClick={() => {
														const noMessage: Message = {
															role: 'user',
															text: 'No, not at the moment',
															showDecisionButtons: false,
															showContactForm: false,
														};
														setMessages((prev) => [...prev, noMessage]);

														const farewell: Message = {
															role: 'assistant',
															text: 'No problem! Feel free to reach out anytime if you need help. You can always click the chat button again to chat with me.',
															showDecisionButtons: false,
															showContactForm: false,
														};
														setMessages((prev) => [...prev, farewell]);
														setConversationPhase('completed');
													}}
													className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors font-poppins"
												>
													No, not now
												</button>
											</div>
										)}

									{/* WhatsApp Button - Only show after streaming completes */}
									{msg.whatsapp && !msg.isStreaming && (
										<div className="mt-3 pt-2 border-t border-gray-200">
											<a
												href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 w-full font-poppins"
											>
												<svg
													className="w-5 h-5"
													fill="currentColor"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
													<path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.123 1.523 5.865L.053 23.14c-.069.27.163.502.433.433l5.275-1.47C7.877 23.447 9.876 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.627-.533-5.124-1.46l-.36-.214-3.332.93.93-3.332-.214-.36C2.533 15.627 2 13.87 2 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10z" />
												</svg>
												<span>Chat on WhatsApp</span>
											</a>
											<p className="text-xs text-gray-500 text-center mt-2 font-poppins">
												Click to connect with our team
											</p>
										</div>
									)}
								</div>
							</div>
						))}

						{loading && (
							<div className="flex justify-start">
								<div className="bg-white text-gray-500 p-3 rounded-lg rounded-bl-none shadow-sm border border-gray-100">
									<div className="flex items-center space-x-2 mb-1">
										<span
											className={`${bangers.className} text-sm text-blue-600 skew-x-[-8deg]`}
										>
											WANDA AI
										</span>
									</div>
									<div className="flex space-x-1">
										<div
											className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
											style={{ animationDelay: '0ms' }}
										></div>
										<div
											className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
											style={{ animationDelay: '150ms' }}
										></div>
										<div
											className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
											style={{ animationDelay: '300ms' }}
										></div>
									</div>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Contact Form - Separate from messages */}
					{showContactForm && conversationPhase === 'contact_form' && (
						<div className="p-4 bg-linear-to-b from-blue-50 to-white border-t border-blue-100">
							<h4 className="font-semibold text-gray-800 mb-2 font-poppins">
								Share your details
							</h4>
							<p className="text-xs text-gray-600 mb-3 font-poppins">
								This helps us better understand your needs and follow up with
								you
							</p>
							<form onSubmit={handleContactSubmit} className="space-y-2">
								<input
									type="text"
									placeholder="Your Full Name *"
									value={contactForm.name}
									onChange={(e) =>
										setContactForm({
											...contactForm,
											name: e.target.value,
										})
									}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-poppins"
									required
								/>
								<input
									type="tel"
									placeholder="Phone Number *"
									value={contactForm.phone}
									onChange={(e) =>
										setContactForm({
											...contactForm,
											phone: e.target.value,
										})
									}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-poppins"
									required
								/>
								<input
									type="email"
									placeholder="Email (optional)"
									value={contactForm.email}
									onChange={(e) =>
										setContactForm({
											...contactForm,
											email: e.target.value,
										})
									}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-poppins"
								/>
								<button
									type="submit"
									disabled={loading || !contactForm.name || !contactForm.phone}
									className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors font-poppins"
								>
									{loading ? 'Saving...' : 'Done'}
								</button>
							</form>
						</div>
					)}

					{/* Input Area */}
					<div className="p-3 bg-white border-t border-gray-200">
						{!showContactForm && conversationPhase !== 'contact_form' && (
							<div className="flex items-center space-x-2">
								<input
									type="text"
									value={input}
									onChange={handleInputChange}
									onKeyDown={handleKeyPress}
									placeholder="Type your message..."
									className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-poppins"
									disabled={loading}
								/>
								<button
									onClick={sendMessage}
									disabled={loading || !input.trim()}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors font-poppins ${
										loading || !input.trim()
											? 'bg-gray-300 text-gray-500 cursor-not-allowed'
											: 'bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
									}`}
								>
									Send
								</button>
							</div>
						)}
						<div className="flex items-center justify-between mt-2 text-xs text-gray-400">
							<span className="font-poppins">Powered by Wandalabs</span>
							<a
								href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1 font-poppins"
							>
								<svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
								</svg>
								<span>WhatsApp</span>
							</a>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
