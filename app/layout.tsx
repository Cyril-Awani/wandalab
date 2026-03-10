import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import CookieBanner from '@/components/CookieBanner';

const montserrat = Montserrat({
	subsets: ['latin'],
	variable: '--font-montserrat',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'Create Digital Experience',
	description:
		'Creative digital agency for web-development, web-design, ai-integration and graphics-design in Nigeria',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${montserrat.variable} font-sans antialiased`}>
				<Navbar />
				{children}
				<CookieBanner />
			</body>
		</html>
	);
}
