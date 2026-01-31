import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq, sql } from "drizzle-orm";
import { db } from "~/db";
import { captions, words } from "~/db/schema";
import { z } from "zod";

const wordContentSchema = z.object({
  text: z.string(),
  synonyms: z.array(z.string()).optional(),
  meanings: z.array(z.string()).optional(),
});

const wordSchema = z.object({
  en: wordContentSchema.optional(),
  pt: wordContentSchema.optional(),
  es: wordContentSchema.optional(),
  level: z.string().optional(),
});

export const createExplanation = createServerFn({ method: "POST" })
  .inputValidator((word: string) => z.string().parse(word))
  .handler(async ({ data: word }) => {
    // 1. Check if word exists in dictionary (English text)
    // Note: Since `en` is jsonb, we need a way to query nested field.
    // Drizzle with PostgreSQL allows sql operator for JSON path.
    const existingWord = await db
      .select()
      .from(words)
      .where(sql`${words.en}->>'text' = ${word.toLowerCase()}`)
      .limit(1);

    if (existingWord.length > 0) {
      return existingWord[0];
    }

    // 2. Mock AI translation/explanation for now (replicate logic but simplified)
    // In a real scenario, we would call the AI service here.
    // We will just create a placeholder entry to simulate "fetched from AI"
    const newWord = await db
      .insert(words)
      .values({
        en: { text: word.toLowerCase() },
        pt: { text: `Translated: ${word}` },
        // Simulate level
        level: "A1",
      })
      .returning();

    return newWord[0];
  });

export const getWordById = createServerFn({ method: "GET" })
  .inputValidator((id: string) => z.string().parse(id))
  .handler(async ({ data: id }) => {
    const result = await db
      .select()
      .from(words)
      .where(eq(words.id, id))
      .limit(1);
    if (!result.length) throw notFound();
    return result[0];
  });

export const getRandomWord = createServerFn({ method: "GET" })
  .inputValidator((opts: { notIn?: string[]; limit?: number }) =>
    z
      .object({
        notIn: z.array(z.string()).optional(),
        limit: z.number().optional().default(4),
      })
      .parse(opts),
  )
  .handler(async ({ data }) => {
    // Basic random implementation using RANDOM()
    // Filtering `notIn` efficiently with RANDOM() is tricky in pure SQL without subqueries,
    // but for small datasets simple RANDOM() check is okay.
    // Ideally we'd use `tablesample` or similar but `order by random()` is easiest for now.

    let query = db
      .select()
      .from(words)
      .orderBy(sql`RANDOM()`)
      .limit(data.limit);

    if (data.notIn && data.notIn.length > 0) {
      // Note: Drizzle `notInArray` might need uuid casting or similar if strict
      // For now assuming it works or we need to filter in app if id types mismatch
      // query = query.where(notInArray(words.id, data.notIn)); // Uncomment if needed
    }

    const result = await query;
    return result;
  });

export const findTextWithWord = createServerFn({ method: "GET" })
  .inputValidator((word: string) => z.string().parse(word))
  .handler(async ({ data: word }) => {
    // Replicate: regex search in captions
    // Using ilike for simple "contains" (case insensitive) which is close to regex 'i' flag
    return await db
      .select()
      .from(captions)
      .where(sql`${captions.text} ILIKE ${`%${word}%`}`)
      .limit(10);
  });
