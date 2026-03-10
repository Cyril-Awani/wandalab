import { Suspense } from 'react';
import IndustriesContent from './IndustriesContent';

// Loading fallback component
function IndustriesLoading() {
	return (
		<div className="min-h-screen bg-white">
			{/* Header Skeleton */}
			<div className="pt-32 px-4 relative overflow-hidden bg-linear-to-b from-gray-50 to-white">
				<div className="mx-auto w-full max-w-3xl relative flex flex-col items-center justify-center text-center">
					<div className="h-20 w-96 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
					<div className="w-full flex justify-center">
						<div className="h-0.5 w-32 bg-gray-300 rounded animate-pulse"></div>
					</div>
					<div className="mt-8 h-16 w-full max-w-2xl bg-gray-200 rounded-lg animate-pulse"></div>
				</div>
			</div>

			{/* Tabs Skeleton */}
			<div className="max-w-7xl mx-auto px-4 py-12">
				<div className="mb-12">
					<div className="flex flex-wrap gap-3 justify-center">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-12 w-32 bg-gray-200 rounded-full animate-pulse"
							></div>
						))}
					</div>
				</div>

				{/* Grid Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className="h-80 bg-gray-200 rounded-2xl animate-pulse"
						></div>
					))}
				</div>
			</div>
		</div>
	);
}

export default function IndustriesPage() {
	return (
		<Suspense fallback={<IndustriesLoading />}>
			<IndustriesContent />
		</Suspense>
	);
}
