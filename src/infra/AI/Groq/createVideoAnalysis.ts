import Groq from 'groq-sdk';

import { client } from './groq';

export type DifficultyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Question {
	startTime: number;
	type: 'multiple-choice' | 'open-ended';
	question: string;
	options?: string[];
	answer: string;
	explanation?: string;
}

export interface VideoAnalysisSchema {
	level: DifficultyLevel;
	phrasalVerbs: string[];
	idioms: string[];
}
class VideoAnalysis {
	level: DifficultyLevel;
	phrasalVerbs: string[];
	idioms: string[];

	constructor(
		level: DifficultyLevel,
		phrasalVerbs: string[],
		idioms: string[],
	) {
		this.level = level;
		this.phrasalVerbs = phrasalVerbs || [];
		this.idioms = idioms || [];
	}
}

const schema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	type: 'object',
	properties: {
		level: {
			type: 'string',
			enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
			description:
				"Required. Level value must be one of A1, A2, B1, B2, C1, C2. It's the CEFR level of the text",
		},
		phrasalVerbs: {
			type: 'array',
			items: { type: 'string' },
			description:
				'Array of strings containing all phrasal verbs present in the text',
		},
		idioms: {
			type: 'array',
			items: { type: 'string' },
			description:
				'Array of strings containing all relevant idioms and figurative language present in the text',
		},
	},
	required: ['level', 'phrasalVerbs', 'idioms'],
	additionalProperties: false,
};

export async function createVideoAnalysis(
	text: string,
): Promise<VideoAnalysisSchema> {
	const jsonSchema = JSON.stringify(schema, null, 4);
	const params: Groq.Chat.CompletionCreateParams = {
		messages: [
			{
				role: 'system',
				content: `You are an english teacher and responsible to get the difficulty level and grammar points based on a video.
You receive the transcript of the video, containing the start time of each text,
example "1343: Hello, my name is John" (That means that this text start in the milisecond 1343).
You must just return a output in JSON. The JSON object must use the schema: ${jsonSchema}.
Just return the JSON object, without any other text or explanation, neither the JSON schema.
Handle each array properly, never as object.`,
			},
			{
				role: 'user',
				content: `For the following text, get all grammar points from ths text, like phrasal verbs, idioms, etc. Remove unneeded articles. You must return just the JSON.
Content: ${text}`,
			},
		],
		// model: 'llama3-Groq-70b-8192-tool-use-preview',
		model: 'llama3-8b-8192',
		temperature: 0.2,
		stream: false,
	};
	const chatCompletion: Groq.Chat.ChatCompletion =
		await client.chat.completions.create(params);

	const content = chatCompletion.choices[0].message.content;
	console.log('content', content);
	if (!content) {
		throw new Error('No content received from Groq API');
	}

	return validateJsonStructureAndFixCommonMistakes(content);
}

function validateJsonStructureAndFixCommonMistakes(
	content: string,
): VideoAnalysisSchema {
	const regex =
		/(\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}|\[(?:[^\[\]]|\[(?:[^\[\]]|\[[^\[\]]*\])*\])*\])/;
	const jsonContent = content?.match(regex)?.[0];

	const parsedContent = JSON.parse(jsonContent || '{}');

	let data: VideoAnalysisSchema;

	try {
		// Validate level
		if (!['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(parsedContent.level)) {
			throw new Error('Invalid level');
		}

		// Validate grammarPoints
		if (!Array.isArray(parsedContent.phrasalVerbs)) {
			throw new Error('Phrasal verbs must be a non-empty array');
		}
		if (!Array.isArray(parsedContent.idioms)) {
			throw new Error('Invalid idioms structure');
		}

		// If all validations pass, create the VideoAnalysis object
		data = new VideoAnalysis(
			parsedContent.level,
			parsedContent.phrasalVerbs,
			parsedContent.idioms,
		);
	} catch (error) {
		console.error('Validation error:', error);
		throw new Error('Invalid data structure received from Groq API');
	}

	return data;
}
