// app/page.js
'use client';
import { useState } from 'react';
import Hero from '@/components/Hero';
import IndustriesCarousel from '@/components/Industry';
import PastProjects from '@/components/Projects';
import ChatWidget from '@/components/ChatWidget'; // Import the chat widget

export default function Home() {
	return (
		<div className="min-h-screen relative">
			<Hero />
			<IndustriesCarousel />
			<PastProjects />

			{/* Add the chat widget */}
			<ChatWidget />
		</div>
	);
}
