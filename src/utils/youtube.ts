import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { Client } from "youtubei";
import { z } from "zod";

import { db } from "~/db";
import { videos, captions } from "~/db/schema";

import {
  VideoAnalysisSchema,
  createVideoAnalysis,
} from "~/infra/AI/Groq/createVideoAnalysis";

const youtube = new Client();

type Caption = {
  videoId: string;
  start: number;
  dur: number;
  text: string;
};

export const searchYoutubeVideos = createServerFn({ method: "GET" })
  .inputValidator((query: string) => z.string().min(1).parse(query))
  .handler(async ({ data: query }) => {
    const search = await youtube.search(query, {
      type: "video",
      features: ["subtitles"],
      duration: "all",
      sortBy: "relevance",
    });

    console.log(query, search);

    return search.items.map(sanitizeVideoObject);
  });

export const getYoutubeVideo = createServerFn({ method: "GET" })
  .inputValidator((externalVideoId: string) =>
    z.string().parse(externalVideoId),
  )
  .handler(async ({ data: externalVideoId }) => {
    // Check if video already exists
    const existingVideo = await db
      .select()
      .from(videos)
      .where(eq(videos.externalId, externalVideoId))
      .limit(1);

    if (existingVideo.length > 0) {
      return existingVideo[0];
    }

    const youtubeVideo = await youtube.getVideo(externalVideoId);

    if (!youtubeVideo) {
      throw new Error("Video not found");
    }

    const youtubeVideoData = sanitizeVideoObject(youtubeVideo);

    if (!youtubeVideo.captions) {
      throw new Error("No captions found");
    }

    let captionsData;
    const languagesToTry = [
      "en",
      "en-US",
      "en-GB",
      "en-CA",
      "en-AU",
      "en-NZ",
      "en-UK",
    ];

    for (const lang of languagesToTry) {
      try {
        captionsData = await youtubeVideo.captions?.get(lang);
        if (captionsData && captionsData.length > 0) {
          console.log(`Captions found in language: ${lang}`);
          break;
        }
      } catch (error: any) {
        console.error(`Failed to get captions for language: ${lang}`, error);
      }
    }

    if (!captionsData || captionsData.length === 0) {
      throw new Error("No captions found in any of the specified languages");
    }

    const captionData = captionsData
      .map((subtitle: any) => {
        const textWithoutIcons = subtitle.text.replace(/[^\w\s\d]/g, "").trim();
        if (!textWithoutIcons.match(/[A-Za-z0-9]/gi)) {
          return null;
        }
        return {
          start: Number(subtitle.start),
          dur: Number(subtitle.duration),
          text: subtitle.text,
        };
      })
      .filter(
        (
          caption: any,
        ): caption is { start: number; dur: number; text: string } =>
          caption !== null,
      )
      .sort((a, b) => a.start - b.start)
      .reduce(
        (acc: { start: number; dur: number; text: string }[], current) => {
          if (!acc.length || acc[acc.length - 1].start !== current.start) {
            acc.push(current);
          }
          return acc;
        },
        [],
      );

    if (!captionData || captionData.length === 0) {
      throw new Error("No captions found");
    }

    const videoAnalysis: VideoAnalysisSchema = await createVideoAnalysis(
      captionData
        .map((caption) => `${caption.start}: ${caption.text}`)
        .join(" "),
    );

    if (!videoAnalysis) {
      throw new Error("No videos analysis made");
    }

    // Insert video
    const insertedVideo = await db
      .insert(videos)
      .values({
        ...youtubeVideoData,
        level: videoAnalysis.level,
        phrasalVerbs: videoAnalysis.phrasalVerbs,
        idioms: videoAnalysis.idioms,
      })
      .returning();

    if (!insertedVideo.length) {
      throw new Error("Video not stored");
    }

    const video = insertedVideo[0];

    // Insert captions
    const captionsToInsert: Caption[] = captionData.map((caption) => ({
      videoId: video.id,
      start: caption.start,
      dur: caption.dur,
      text: caption.text,
    }));

    if (captionsToInsert.length > 0) {
      await db.insert(captions).values(captionsToInsert);
    }

    return video;
  });

type Video = typeof videos.$inferInsert;

type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

export function sanitizeVideoObject(video: any): Omit<Video, "id"> {
  const thumbnails = video.thumbnails
    ? Object.keys(video.thumbnails).reduce(
        (acc, key: string) => {
          acc[key] = {
            url: video.thumbnails[key].url,
            width: video.thumbnails[key].width,
            height: video.thumbnails[key].height,
          };
          return acc;
        },
        {} as Record<string, Thumbnail>,
      )
    : {};

  const sanitizedVideo: Omit<Video, "id"> = {
    externalId: video.id,
    name: video.title,
    description: video.description,
    thumbnails: thumbnails,
    publishedAt: Date.parse(video.uploadDate)
      ? new Date(video.uploadDate)
      : null,
    duration: Number(video.duration),
    viewCount: video.viewCount,
    tags: video.tags,
    channel: {
      externalId: video.channel?.id,
      name: video.channel?.name,
      thumbnails: video.channel?.thumbnails,
    },
  };

  return sanitizedVideo;
}
