import React from 'react';

import { LearningItem } from './LearningItem';

export const LearningPathPage = () => {
	const items = [
		{
			title: 'Introduction to English',
			content: [
				'Alphabet',
				'Basic Greetings',
				'Numbers and Colors',
				'Days of the Week and Months',
				'Common Classroom Phrases',
			],
		},
		{
			title: 'Verb To Be',
			content: [
				'Conjugation: am, is, are',
				'Positive, Negative, and Question Forms',
				'When to Use: Identity, Location, Feelings',
				'How to Use in Sentences',
				'Examples and Practice Exercises',
			],
		},
		{
			title: 'Nouns and Articles',
			content: [
				'Types of Nouns: Common and Proper',
				'Countable and Uncountable Nouns',
				'Definite and Indefinite Articles',
				'Using Articles with Nouns',
				'Plural Forms of Nouns',
				'Practice Exercises',
			],
		},
		{
			title: 'Pronouns',
			content: [
				'Personal Pronouns: Subject and Object',
				'Possessive Pronouns',
				'Reflexive Pronouns',
				'Demonstrative Pronouns',
				'Indefinite Pronouns',
				'Examples and Practice',
			],
		},
		{
			title: 'Basic Tenses',
			content: [
				'Present Simple',
				'Present Continuous',
				'Past Simple',
				'Future Simple',
				'Forming Questions and Negatives',
				'Usage and Time Expressions',
				'Examples and Exercises',
			],
		},
		{
			title: 'Modal Verbs',
			content: [
				'Can, Could, May, Might',
				'Must, Have to, Should',
				'Uses of Modals: Ability, Permission, Obligation',
				'Forming Questions and Negatives with Modals',
				'Examples and Practice',
			],
		},
		{
			title: 'Adjectives and Adverbs',
			content: [
				'Types of Adjectives',
				'Comparative and Superlative Forms',
				'Position of Adjectives in Sentences',
				'Types of Adverbs',
				'Forming Adverbs from Adjectives',
				'Position of Adverbs in Sentences',
				'Examples and Practice',
			],
		},
		{
			title: 'Prepositions',
			content: [
				'Prepositions of Time: at, in, on',
				'Prepositions of Place: in, on, under, behind, etc.',
				'Prepositions of Movement: to, through, into, etc.',
				'Prepositional Phrases',
				'Examples and Practice',
			],
		},
		{
			title: 'Sentences and Questions',
			content: [
				'Basic Sentence Structure: Subject, Verb, Object',
				'Simple vs. Compound Sentences',
				'Types of Questions: Yes/No, WH- Questions',
				'Forming Questions in Different Tenses',
				'Negative Sentences',
				'Examples and Practice',
			],
		},
		{
			title: 'Vocabulary Building',
			content: [
				'Common Verbs and Their Meanings',
				'Everyday Vocabulary: Food, Travel, Shopping',
				'Synonyms and Antonyms',
				'Collocations and Phrasal Verbs',
				'Idiomatic Expressions',
				'Word Formation: Prefixes and Suffixes',
			],
		},
		{
			title: 'Listening and Speaking',
			content: [
				'Pronunciation Practice',
				'Intonation and Stress',
				'Listening for Specific Information',
				'Role Plays and Dialogues',
				'Debate and Discussion Topics',
				'Storytelling',
			],
		},
		{
			title: 'Reading and Writing',
			content: [
				'Reading Comprehension Strategies',
				'Summarizing Texts',
				'Writing Paragraphs: Topic Sentences and Supporting Details',
				'Writing Essays: Structure and Coherence',
				'Descriptive, Narrative, and Opinion Essays',
				'Peer Review and Feedback',
			],
		},
	];
	return (
		<div className="p-5 space-y-2">
			{items.map((item) => (
				<LearningItem
					key={item.title}
					title={item.title}
					content={item.content}
				/>
			))}
		</div>
	);
};
