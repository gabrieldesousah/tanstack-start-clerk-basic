import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq, ilike, or } from "drizzle-orm";
import { db } from "~/db";
import { videos } from "~/db/schema";
import { z } from "zod";

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Channel {
  _id?: string;
  externalId: string;
  name: string;
  thumbnails: any;
}

export type DifficultyLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// Zod schemas for validation
const thumbnailSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

const channelSchema = z.object({
  _id: z.string().optional(),
  externalId: z.string(),
  name: z.string(),
  thumbnails: z.any(),
});

const videoSchema = z.object({
  name: z.string(),
  externalId: z.string(),
  description: z.string(),
  thumbnails: z.array(thumbnailSchema),
  publishedAt: z
    .union([z.date(), z.string()])
    .transform((val) => new Date(val))
    .optional(),
  duration: z.number(),
  viewCount: z.string(),
  tags: z.array(z.string()).optional(),
  channel: channelSchema.optional(),
  phrasalVerbs: z.array(z.string()).optional(),
  idioms: z.array(z.string()).optional(),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
});

export const getVideo = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data }) => {
    const result = await db
      .select()
      .from(videos)
      .where(eq(videos.id, data))
      .limit(1);

    if (result.length === 0) {
      throw notFound();
    }

    return result[0];
  });

export const createVideo = createServerFn({ method: "POST" })
  .inputValidator(videoSchema)
  .handler(async ({ data }) => {
    const result = await db
      .insert(videos)
      .values({
        name: data.name,
        externalId: data.externalId,
        description: data.description,
        thumbnails: data.thumbnails,
        publishedAt: data.publishedAt,
        duration: data.duration,
        viewCount: data.viewCount,
        tags: data.tags,
        channel: data.channel,
        phrasalVerbs: data.phrasalVerbs,
        idioms: data.idioms,
        level: data.level,
      })
      .returning();
    return result[0];
  });

export const updateVideo = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { id: string; updates: Partial<z.infer<typeof videoSchema>> }) => {
      const updateSchema = z.object({
        id: z.string(),
        updates: videoSchema.partial(),
      });
      return updateSchema.parse(data);
    },
  )
  .handler(async ({ data }) => {
    const result = await db
      .update(videos)
      .set(data.updates)
      .where(eq(videos.id, data.id))
      .returning();
    return result[0];
  });

export const removeVideo = createServerFn({ method: "POST" })
  .inputValidator((data: string) => z.string().parse(data))
  .handler(async ({ data }) => {
    await db.delete(videos).where(eq(videos.id, data));
    return { success: true };
  });

export const searchVideos = createServerFn({ method: "GET" })
  .validator((query: string) => z.string().min(1).parse(query))
  .handler(async ({ data: query }) => {
    const result = await db
      .select()
      .from(videos)
      .where(
        or(
          ilike(videos.name, `%${query}%`),
          ilike(videos.description, `%${query}%`),
        ),
      );

    return result;
  });
