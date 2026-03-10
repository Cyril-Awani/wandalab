// app/about/page.tsx
'use client';

import { Bangers } from 'next/font/google';
import {
	Calendar,
	Target,
	Users,
	Rocket,
	Award,
	Heart,
	Lightbulb,
	Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const bangers = Bangers({
	weight: '400',
	subsets: ['latin'],
});

export default function AboutPage() {
	const stats = [
		{
			number: '2024',
			label: 'Year Founded',
			icon: <Calendar className="w-6 h-6" />,
		},
		{
			number: '5+',
			label: 'Projects Completed',
			icon: <Rocket className="w-6 h-6" />,
		},
		{
			number: '4+',
			label: 'Happy Clients',
			icon: <Users className="w-6 h-6" />,
		},
		{ number: '3', label: 'Team Members', icon: <Heart className="w-6 h-6" /> },
	];

	const values = [
		{
			icon: <Lightbulb className="w-8 h-8" />,
			title: 'Innovation First',
			description:
				'We push boundaries and embrace new technologies to deliver cutting-edge solutions.',
		},
		{
			icon: <Target className="w-8 h-8" />,
			title: 'Client-Centered',
			description:
				'Your success is our success. We work closely with you to achieve your goals.',
		},
		{
			icon: <Award className="w-8 h-8" />,
			title: 'Quality Driven',
			description:
				'We never compromise on quality. Every pixel, every line of code matters.',
		},
		{
			icon: <Sparkles className="w-8 h-8" />,
			title: 'Creative Excellence',
			description:
				'Design that inspires, engages, and leaves a lasting impression.',
		},
	];

	const timeline = [
		{
			year: '2024',
			title: 'The Beginning',
			description:
				'Awandalabs was founded with a vision to transform digital experiences.',
		},
		{
			year: '2024',
			title: 'First Projects',
			description:
				'Successfully launched our first web and design projects for local businesses.',
		},
		{
			year: '2024',
			title: 'Team Growth',
			description: 'Expanded our team with talented designers and developers.',
		},
		{
			year: '2024',
			title: 'Looking Forward',
			description: 'Continuing to grow and innovate, ready for new challenges.',
		},
	];

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="pt-32 pb-8 px-4 relative overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-5">
					<div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600 rounded-full blur-3xl" />
					<div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-600 rounded-full blur-3xl" />
				</div>

				<div className="container mx-auto max-w-5xl relative">
					<div className="text-center">
						<h1
							className={`${bangers.className} text-6xl md:text-7xl lg:text-8xl mb-6 tracking-wider transform skew-x-[-5deg]`}
						>
							<span className="bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
								About
							</span>
							<br />
							<span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
								Awandalabs
							</span>
						</h1>

						<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
							Founded in 2024, Awani Design Labs (awandalabs) is a creative
							digital agency dedicated to crafting exceptional web experiences,
							stunning designs, and innovative solutions for businesses of all
							sizes.
						</p>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 px-4">
				<div className="container mx-auto max-w-6xl">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{stats.map((stat, index) => (
							<div
								key={index}
								className="bg-linear-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 text-center hover:shadow-lg transition-all"
							>
								<div className="w-12 h-12 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
									{stat.icon}
								</div>
								<div className="text-3xl font-bold text-gray-900 mb-1">
									{stat.number}
								</div>
								<div className="text-sm text-gray-600">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Story Section */}
			<section className="py-20 px-4 bg-linear-to-br from-gray-50 to-white">
				<div className="container mx-auto max-w-5xl">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-3xl md:text-4xl font-bold mb-6">
								Our{' '}
								<span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
									Story
								</span>
							</h2>
							<div className="space-y-4 text-gray-600">
								<p>
									Awandalabs was born from a simple idea: create digital
									experiences that truly make a difference. Starting in 2024, we
									set out to combine cutting-edge technology with beautiful
									design to help businesses thrive in the digital world.
								</p>
								<p>
									What makes us different? We're not just developers or
									designers, we're partners in your success. Every project we
									take on is an opportunity to innovate, to push boundaries, and
									to deliver something extraordinary.
								</p>
								<p>
									Today, we're proud to work with clients across various
									industries, helping them transform their digital presence and
									achieve their goals. But we're just getting started.
								</p>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-4">
								<div className="bg-linear-to-br from-indigo-600 to-purple-600 p-8 rounded-2xl text-white">
									<div className="text-4xl font-bold mb-2">2024</div>
									<div className="text-sm opacity-90">Year Founded</div>
								</div>
								<div className="bg-gray-900 p-8 rounded-2xl text-white">
									<div className="text-4xl font-bold mb-2">5+</div>
									<div className="text-sm opacity-90">Projects</div>
								</div>
							</div>
							<div className="space-y-4 mt-8">
								<div className="bg-gray-900 p-8 rounded-2xl text-white">
									<div className="text-4xl font-bold mb-2">4+</div>
									<div className="text-sm opacity-90">Clients</div>
								</div>
								<div className="bg-linear-to-br from-purple-600 to-pink-600 p-8 rounded-2xl text-white">
									<div className="text-4xl font-bold mb-2">5</div>
									<div className="text-sm opacity-90">Dept</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Our{' '}
							<span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
								Core Values
							</span>
						</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							The principles that guide everything we do
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{values.map((value, index) => (
							<div
								key={index}
								className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-all group"
							>
								<div className="w-14 h-14 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
									{value.icon}
								</div>
								<h3 className="text-xl font-bold mb-2">{value.title}</h3>
								<p className="text-gray-600">{value.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Team Section */}
			<section className="py-20 px-4 bg-linear-to-br from-gray-50 to-white">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Meet the{' '}
							<span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
								Team
							</span>
						</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							The creative minds behind awandalabs
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								name: 'Awani',
								role: 'Founder & Creative Director',
								bio: 'Visionary designer with a passion for creating beautiful digital experiences.',
							},
							{
								name: 'Tim Maro',
								role: 'Lead Developer',
								bio: 'Full-stack developer who turns complex problems into elegant solutions.',
							},
							{
								name: 'Adidue Sweetie',
								role: 'UI/UX Designer',
								bio: 'User experience expert focused on creating intuitive, engaging interfaces.',
							},
						].map((member, index) => (
							<div
								key={index}
								className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all"
							>
								<div className="w-24 h-24 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
									{member.name[0]}
								</div>
								<h3 className="text-xl font-bold text-center mb-1">
									{member.name}
								</h3>
								<p className="text-indigo-600 text-sm text-center mb-3">
									{member.role}
								</p>
								<p className="text-gray-600 text-center text-sm">
									{member.bio}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="pb-8 px-4">
				<div className="container mx-auto max-w-4xl">
					<div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Ready to Work Together?
						</h2>
						<p className="text-xl mb-8 opacity-90">
							Let's create something amazing together
						</p>
						<Link
							href="/contact"
							className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
						>
							Get in Touch
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
