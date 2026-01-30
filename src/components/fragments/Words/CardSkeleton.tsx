import * as React from 'react';

import { WordCard } from '~/components/fragments/Words/WordCard';
import { Skeleton } from '~/components/ui/skeleton';

export const CardSkeleton = () => {
	return (
		<WordCard className="p-10 gap-2">
			<Skeleton className="h-12 w-64 rounded" />
			<Skeleton className="h-12 w-96 rounded" />
			<Skeleton className="h-12 w-80 rounded" />
			<Skeleton className="h-12 w-80 rounded" />
		</WordCard>
	);
};
