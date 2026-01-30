import * as React from 'react';

import { cn } from '~/lib/utils';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog';

import { WordDialogContent } from './WordDialogContent';

export const WordDialogExplanation = ({
	word,
	handleDialogOpenChange,
	className,
}: {
	word: string;
	handleDialogOpenChange?: (open: boolean) => void;
	className?: string;
}) => {
	return (
		<Dialog onOpenChange={handleDialogOpenChange}>
			<DialogTrigger asChild>
				<span className={cn('hover:underline cursor-pointer', className)}>
					{word}
				</span>
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogTitle>Dictionary</DialogTitle>
				<WordDialogContent word={word} />
			</DialogContent>
		</Dialog>
	);
};
