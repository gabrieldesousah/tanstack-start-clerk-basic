import { Video } from '/imports/api/videos/collections';

export function sanitizeVideoObject(video: any) {
	const sanitizedVideo: Video = {
		externalId: video.id,
		name: video.title,
		description: video.description,
		thumbnails: video.thumbnails,
		publishedAt: Date.parse(video.uploadDate)
			? new Date(video.uploadDate)
			: video.uploadDate,
		duration: Number(video.duration),
		viewCount: video.viewCount,
		tags: video.tags,
		channel: {
			externalId: video.channel?.id,
			name: video.channel?.name,
			thumbnails: video.channel?.thumbnails,
		},
		createdAt: new Date(),
	};

	// Ensure thumbnails are simple objects
	if (sanitizedVideo.thumbnails) {
		sanitizedVideo.thumbnails = Object.keys(sanitizedVideo.thumbnails).reduce(
			(acc, key: any) => {
				acc[key] = {
					url: sanitizedVideo.thumbnails[key].url,
					width: sanitizedVideo.thumbnails[key].width,
					height: sanitizedVideo.thumbnails[key].height,
				};
				return acc;
			},
			{} as any,
		);
	}

	return sanitizedVideo;
}
