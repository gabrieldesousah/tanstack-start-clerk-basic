import Groq from 'groq-sdk';

import { client } from './groq';

export interface Translation {
	en_meanings: string[];
	en_synonyms?: string[];
	pt_translation: string;
	pt_synonyms?: string[];
	pt_meanings: string[];
	es_translation: string;
	es_synonyms?: string[];
	es_meanings: string[];
	difficulty_level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

const schema = {
	type: 'object',
	properties: {
		en_meanings: { type: 'array', items: { type: 'string' } },
		en_synonyms: {
			type: 'array',
			items: { type: 'string' },
			nullable: true,
		},
		pt_translation: { type: 'string' },
		pt_synonyms: {
			type: 'array',
			items: { type: 'string' },
			nullable: true,
		},
		pt_meanings: { type: 'array', items: { type: 'string' } },
		es_translation: { type: 'string' },
		es_synonyms: {
			type: 'array',
			items: { type: 'string' },
			nullable: true,
		},
		es_meanings: { type: 'array', items: { type: 'string' } },
		difficulty_level: {
			type: 'string',
			enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
			description: "It's the CEFR level of the text",
		},
	},
	required: [
		'en_meanings',
		'pt_translation',
		'pt_meanings',
		'es_translation',
		'es_meanings',
		'difficulty_level',
	],
	additionalProperties: false,
};

export async function translateText(text: string): Promise<Translation> {
	const jsonSchema = JSON.stringify(schema, null, 4);
	const params: Groq.Chat.CompletionCreateParams = {
		messages: [
			{
				role: 'system',
				content: `You are part of a software to translate a text for Portuguese and Spanish.
			 	You need to return the meanings of the word in these language and in english.
				You must just return JSON, without any other text or comment.
				The JSON object must use this schema: ${jsonSchema}`,
			},
			{
				role: 'user',
				content: `Based on the following text: ${text}, create a json with meanings, translations and synonyms.
				Force the rule that when you have the prefix "PT", you must write in portuguese.
				When you have the prefix "ES" you must write in spanish.
				When you have the prefix "EN" you must write in english.
				Be concise and just write the necessary information.
				Return a valid JSON object.`,
			},
		],
		model: 'llama3-8b-8192',
	};
	const chatCompletion: Groq.Chat.ChatCompletion =
		await client.chat.completions.create(params);

	const content = chatCompletion.choices[0].message.content;

	const regex = /({[\s\S]*?}|\[[\s\S]*?\])/g;
	const jsonContent = content?.match(regex)?.[0];

	let parsedContent: unknown;
	try {
		parsedContent = JSON.parse(jsonContent?.replace(/\\_/g, '_') || '{}');
	} catch (error: any) {
		throw new Error('Invalid JSON received from Groq API', error);
	}

	if (
		typeof parsedContent === 'object' &&
		parsedContent !== null &&
		'difficulty_level' in parsedContent &&
		'en_meanings' in parsedContent &&
		'pt_translation' in parsedContent &&
		'pt_meanings' in parsedContent &&
		'es_translation' in parsedContent &&
		'es_meanings' in parsedContent &&
		Array.isArray(parsedContent?.en_meanings) &&
		typeof parsedContent?.pt_translation === 'string' &&
		typeof parsedContent?.es_translation === 'string' &&
		Array.isArray(parsedContent?.pt_meanings)
	) {
		return parsedContent as Translation;
	} else {
		throw new Error('Received data does not match Translation interface');
	}
}
