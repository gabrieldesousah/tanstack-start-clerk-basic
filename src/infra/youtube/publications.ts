import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { CaptionsCollection } from '/imports/api/captions/collections';

Meteor.publish(
	'youtube.captions',
	function (videoId: string, page: number = 1, perPage: number = 0) {
		check(videoId, String);
		check(page, Number);
		check(perPage, Number);

		const skip = (page - 1) * perPage;

		return CaptionsCollection.find(
			{ videoId: videoId },
			{
				sort: { start: 1 },
				skip: skip,
				limit: perPage,
			},
		);
	},
);
