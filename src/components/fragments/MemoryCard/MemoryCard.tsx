import React, { useEffect, useState } from 'react';

import { Meteor } from 'meteor/meteor';

import { UserLearningWord } from '/imports/api/user-learning/words/collections';
import { Dictionary } from '/imports/api/words/collections';

import { ReviewWordDifficulty } from '/imports/ui/Pages/ReviewWordDifficulty';

import { FlipCardComponent } from './FlipCardComponent';

export const MemoryCard = ({
	learningWord,
	setCompleted,
}: {
	learningWord: UserLearningWord;
	setCompleted?: () => void;
}) => {
	const [dictionaryWord, setDictionaryWord] = useState<Dictionary>();
	useEffect(() => {
		Meteor.call(
			'words.find',
			learningWord.wordId,
			(error: Error, result: Dictionary) => {
				if (error) {
					console.error(error);
					return;
				}
				setDictionaryWord(result);
			},
		);
	}, [learningWord?.wordId]);

	console.log('learningWord', learningWord);
	return (
		<div className="mx-auto flex flex-col p-5 gap-4 justify-center items-center">
			<FlipCardComponent dictionaryWord={dictionaryWord} />
			<ReviewWordDifficulty
				className="z-50"
				learningWord={learningWord}
				setCompleted={setCompleted}
			/>
		</div>
	);
};
