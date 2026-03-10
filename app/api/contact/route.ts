import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
	name: string;
	phone: string;
	email?: string;
	timestamp?: string;
}

export async function POST(req: NextRequest) {
	try {
		const data: ContactFormData = await req.json();

		// Validate required fields
		if (!data.name || !data.phone) {
			return NextResponse.json(
				{ error: 'Name and phone are required' },
				{ status: 400 },
			);
		}

		// Your Google Apps Script Web App URL
		const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

		if (!GOOGLE_SHEETS_URL) {
			console.error('Google Sheets URL not configured');
			return NextResponse.json(
				{ error: 'Server configuration error' },
				{ status: 500 },
			);
		}

		// Send to Google Sheets
		const response = await fetch(GOOGLE_SHEETS_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: data.name,
				phone: data.phone,
				email: data.email || '',
				timestamp: data.timestamp || new Date().toISOString(),
				source: 'Chat Widget',
			}),
		});

		if (!response.ok) {
			throw new Error('Failed to save to Google Sheets');
		}

		return NextResponse.json({
			success: true,
			message: 'Contact information saved successfully',
		});
	} catch (error) {
		console.error('Contact API Error:', error);
		return NextResponse.json(
			{ error: 'Failed to save contact information' },
			{ status: 500 },
		);
	}
}
