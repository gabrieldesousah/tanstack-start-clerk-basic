import * as React from 'react';

import { cn } from '~/lib/utils';

export const WordCard = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className="mx-auto flex flex-col p-5 gap-4 justify-center items-center">
			<div className="group w-full lg:w-[600px] h-[350px]">
				<div className="relative h-full w-full rounded-xl shadow-xl border transition-all duration-500 [transform-style:preserve-3d]">
					<div className="absolute inset-0 h-full w-full rounded-xl bg-card text-card-foreground">
						<div className="flex min-h-full flex-col items-start justify-center w-full">
							<div
								className={cn(
									'flex min-h-full flex-col items-start justify-center w-full',
									className,
								)}
							>
								{children}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
