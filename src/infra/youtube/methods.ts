import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Client } from 'youtubei';

import { Caption, CaptionsCollection } from '/imports/api/captions/collections';
import { Video, VideosCollection } from '/imports/api/videos/collections';

import {
	VideoAnalysisSchema,
	createVideoAnalysis,
} from '/imports/infra/AI/Groq/createVideoAnalysis';
import { sanitizeVideoObject } from '/imports/infra/youtube/utils';

const youtube = new Client();

export async function searchYoutubeVideos(query: string) {
	check(query, String);
	const search = await youtube.search(query, {
		type: 'video', // videos | playlist | channel | all
		features: ['subtitles'],
		duration: 'all',
		sortBy: 'relevance',
	});

	return search.items.map(sanitizeVideoObject);
}

export async function getYoutubeVideo({
	externalVideoId,
}: {
	externalVideoId: string;
}): Promise<Video | undefined> {
	check(externalVideoId, String);

	const findVideo = await VideosCollection.findOneAsync({
		externalId: externalVideoId,
	});

	if (findVideo) {
		return findVideo;
	}

	const youtubeVideo = await youtube.getVideo(externalVideoId);
	const youtubeVideoData = sanitizeVideoObject(youtubeVideo);

	if (!youtubeVideo) {
		throw new Meteor.Error('Video not found');
	}

	if (!youtubeVideo.captions) {
		throw new Meteor.Error('No captions found');
	}

	let captions;
	const languagesToTry = [
		'en',
		'en-US',
		'en-GB',
		'en-CA',
		'en-AU',
		'en-NZ',
		'en-UK',
	];

	for (const lang of languagesToTry) {
		try {
			captions = await youtubeVideo.captions?.get(lang);
			if (captions && captions.length > 0) {
				console.log(`Captions found in language: ${lang}`);
				break;
			}
		} catch (error: any) {
			console.error(`Failed to get captions for language: ${lang}`, error);
		}
	}

	if (!captions || captions.length === 0) {
		throw new Meteor.Error(
			'No captions found in any of the specified languages',
		);
	}

	const captionData: Caption[] | undefined = captions
		?.map((subtitle: any): Caption | null => {
			const textWithoutIcons = subtitle.text.replace(/[^\w\s\d]/g, '').trim();
			if (!textWithoutIcons.match(/[A-Za-z0-9]/gi)) {
				return null;
			}
			return {
				start: Number(subtitle.start),
				dur: Number(subtitle.duration),
				text: subtitle.text,
			};
		})
		.filter((caption: any): caption is Caption => caption !== null)
		.sort((a, b) => a.start - b.start)
		.reduce((acc: Caption[], current: Caption) => {
			if (!acc.length || acc[acc.length - 1].start !== current.start) {
				acc.push(current);
			}
			return acc;
		}, []);

	if (!captionData) {
		throw new Meteor.Error('No captions found');
	}

	const videoAnalysis: VideoAnalysisSchema = await createVideoAnalysis(
		captionData
			?.map((caption) => `${caption.start}: ${caption.text}`)
			.join(' '),
	);

	if (!videoAnalysis) {
		throw new Meteor.Error('No videos analysis made');
	}

	const result = await VideosCollection.upsertAsync(
		{ externalId: youtubeVideo.id },
		{
			...youtubeVideoData,
			level: videoAnalysis.level,
			phrasalVerbs: videoAnalysis.phrasalVerbs,
			idioms: videoAnalysis.idioms,
		},
	);

	if (!result || !result.insertedId) {
		throw new Meteor.Error('Video not stored');
	}

	if (!result) {
		throw new Meteor.Error('Video not stored');
	}

	const bulk = CaptionsCollection.rawCollection().initializeUnorderedBulkOp();
	captionData.forEach((caption: Caption) => {
		bulk.insert({ ...caption, videoId: result.insertedId?.toString() });
	});

	await bulk.execute();

	const video = await VideosCollection.findOneAsync({ _id: result.insertedId });

	if (!video) throw new Meteor.Error('Video not found after insert');

	return video;
}

Meteor.methods({
	'youtube.search': searchYoutubeVideos,
	'youtube.getVideo': getYoutubeVideo,
});
