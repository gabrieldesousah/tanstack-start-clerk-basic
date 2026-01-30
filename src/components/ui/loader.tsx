import React from 'react';

import { Loader2 } from 'lucide-react';

import { cn } from '~/lib/utils';

export const LoaderSpinner = ({ className }: { className?: string }) => {
	return (
		<span className="animate-spin">
			<Loader2
				className={cn('text-gray-300 animate-spin h-10 w-10', className)}
			/>
		</span>
	);
};
