import React, { useEffect } from 'react';

import { Undo } from 'lucide-react';

import { Dictionary } from '/imports/api/words/collections';

import { WordMeaningAndAlternative } from '~/components/fragments/Words/WordMeaningAndAlternative';
import { Button } from '~/components/ui/button';

export const FlipCardComponent = ({
	dictionaryWord,
}: {
	dictionaryWord?: Dictionary;
}) => {
	const [isFlipped, setIsFlipped] = React.useState(false);

	const handleFlip = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsFlipped(!isFlipped);
	};

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.code === 'Space') {
				event.preventDefault();
				setIsFlipped((state) => !state);
			}
		};

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
			setIsFlipped(false);
		};
	}, [dictionaryWord]);

	return (
		<div className="group w-full lg:w-[600px] h-[350px] [perspective:1000px]">
			<div
				className={`relative h-full w-full rounded-xl shadow-xl border transition-all duration-500 [transform-style:preserve-3d] ${
					isFlipped ? '[transform:rotateY(180deg)]' : ''
				}`}
			>
				{/* Front Face */}
				<div
					className={`absolute inset-0 h-full w-full rounded-xl [backface-visibility:hidden] overflow-auto bg-card text-card-foreground ${isFlipped ? 'pointer-events-none' : ''}`}
				>
					<div className="flex min-h-full flex-col items-start justify-center">
						<div className="p-6">
							{dictionaryWord && (
								<WordMeaningAndAlternative
									dictionaryWord={dictionaryWord}
									lang="en"
									className="relative z-10"
								/>
							)}
						</div>
					</div>
					<FlipButton handleFlip={handleFlip} />
				</div>
				{/* Back Face */}
				<div
					className={`absolute inset-0 h-full w-full rounded-xl [backface-visibility:hidden] overflow-auto [transform:rotateY(180deg)] bg-muted text-muted-foreground ${!isFlipped ? 'pointer-events-none' : ''}`}
				>
					<div className="flex min-h-full flex-col items-start justify-center">
						<div className="p-6">
							{dictionaryWord && (
								<WordMeaningAndAlternative
									dictionaryWord={dictionaryWord}
									lang="pt"
									className="relative z-10"
								/>
							)}
						</div>
					</div>
					<FlipButton handleFlip={handleFlip} />
				</div>
			</div>
		</div>
	);
};

const FlipButton = ({
	handleFlip,
}: {
	handleFlip: (e: React.MouseEvent) => void;
}) => {
	return (
		<div
			onClick={handleFlip}
			className="absolute z-0 top-0 right-0 w-full h-full cursor-pointer"
		>
			<Button
				variant="link"
				className="absolute top-4 right-4 decoration-transparent"
			>
				<Undo className="w-4 h-4" />
				Flip
			</Button>
		</div>
	);
};
