import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { db } from "~/db";
import { captions } from "~/db/schema";
import { z } from "zod";

const captionSchema = z.object({
  videoId: z.string(),
  start: z.number(),
  dur: z.number(),
  text: z.string(),
});

export const getCaptionsByVideoId = createServerFn({ method: "GET" })
  .inputValidator((videoId: string) => z.string().parse(videoId))
  .handler(async ({ data: videoId }) => {
    return db
      .select()
      .from(captions)
      .where(eq(captions.videoId, videoId))
      .orderBy(asc(captions.start));
  });

export const getCaption = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.coerce.number().parse(data))
  .handler(async ({ data }) => {
    const result = await db
      .select()
      .from(captions)
      .where(eq(captions.id, data))
      .limit(1);

    if (result.length === 0) {
      throw notFound();
    }

    return result[0];
  });

export const createCaption = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => captionSchema.parse(data))
  .handler(async ({ data }) => {
    const result = await db
      .insert(captions)
      .values({
        videoId: data.videoId,
        start: data.start,
        dur: data.dur,
        text: data.text,
      })
      .returning();
    return result[0];
  });

export const updateCaption = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const updateSchema = z.object({
      id: z.coerce.number(),
      updates: captionSchema.partial(),
    });
    return updateSchema.parse(data);
  })
  .handler(async ({ data }) => {
    const result = await db
      .update(captions)
      .set(data.updates)
      .where(eq(captions.id, data.id))
      .returning();
    return result[0];
  });

export const removeCaption = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.coerce.number().parse(data))
  .handler(async ({ data }) => {
    await db.delete(captions).where(eq(captions.id, data));
    return { success: true };
  });
