import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, notInArray, sql } from "drizzle-orm";
import { db } from "~/db";
import { userLearningWords, words } from "~/db/schema";
import { z } from "zod";
import { dateDiffInHours } from "~/lib/dates";
import { fetchClerkAuth } from "~/infra/auth/checkAuth";

export const getUserLearningWords = createServerFn({ method: "GET" }).handler(
  async () => {
    const { userId } = await fetchClerkAuth();
    if (!userId) throw new Error("Unauthorized");

    const result = await db
      .select()
      .from(userLearningWords)
      .where(eq(userLearningWords.userId, userId))
      .orderBy(asc(userLearningWords.nextReviewAt));

    return result;
  },
);

export enum UserDifficultyRate {
  VeryEasy = "1",
  Easy = "2",
  Medium = "3",
  Hard = "4",
  VeryHard = "5",
}

export const createUserLearningWord = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      wordId: string;
      nextReviewAt?: string;
      difficultyRate?: UserDifficultyRate;
    }) =>
      z
        .object({
          wordId: z.string(),
          nextReviewAt: z.string().optional(),
          difficultyRate: z.nativeEnum(UserDifficultyRate).optional(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    const { userId } = await fetchClerkAuth();
    if (!userId) throw new Error("Unauthorized");

    const existing = await db
      .select()
      .from(userLearningWords)
      .where(
        and(
          eq(userLearningWords.wordId, data.wordId),
          eq(userLearningWords.userId, userId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new Error("Word already saved");
    }

    const initialDifficulty = data.difficultyRate
      ? [
          {
            rate: data.difficultyRate,
            reviewedAt: new Date().toISOString(),
          },
        ]
      : [];

    await db.insert(userLearningWords).values({
      userId,
      wordId: data.wordId,
      difficultyRate: initialDifficulty,
      nextReviewAt: data.nextReviewAt
        ? new Date(data.nextReviewAt)
        : new Date(),
    });

    return { success: true };
  });

export const getUnlearnedWords = createServerFn({ method: "GET" })
  .inputValidator((data?: { limit?: number }) =>
    z
      .object({
        limit: z.number().optional().default(10),
      })
      .optional()
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { userId } = await fetchClerkAuth();
    if (!userId) throw new Error("Unauthorized");

    const userWordIds = db
      .select({ wordId: userLearningWords.wordId })
      .from(userLearningWords)
      .where(eq(userLearningWords.userId, userId));

    const result = await db
      .select()
      .from(words)
      .where(notInArray(words.id, userWordIds))
      .orderBy(sql`RANDOM()`)
      .limit(data?.limit ?? 10);

    return result;
  });

export const updateDifficulty = createServerFn({ method: "POST" })
  .inputValidator((data: { learningWordId: string; difficulty: string }) =>
    z
      .object({
        learningWordId: z.string(),
        difficulty: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { userId } = await fetchClerkAuth();
    if (!userId) throw new Error("Unauthorized");

    const result = await db
      .select()
      .from(userLearningWords)
      .where(eq(userLearningWords.id, data.learningWordId))
      .limit(1);

    if (result.length === 0) throw new Error("Word not found");

    const learningWord = result[0];

    const rates =
      (learningWord.difficultyRate as Array<{
        rate: string;
        reviewedAt: string;
      }>) || [];
    const lastReviewAt =
      rates.length > 0
        ? new Date(rates[rates.length - 1].reviewedAt)
        : undefined;
    const nextReviewAt = learningWord.nextReviewAt;
    const difficultyLevel = data.difficulty as UserDifficultyRate;

    const difficultyFactor: Record<string, number> = {
      [UserDifficultyRate.VeryEasy]: 2,
      [UserDifficultyRate.Easy]: 1.5,
      [UserDifficultyRate.Medium]: 1.2,
    };
    const ONE_HOUR_IN_MS = 1000 * 60 * 60;
    const ONE_MINUTE_IN_MS = 60 * 1000;
    const ONE_DAY_IN_HOURS = 24;

    const calculateNextReviewAt = (): Date => {
      const now = new Date();
      if (!lastReviewAt || !nextReviewAt) {
        return new Date();
      }

      if (difficultyLevel === UserDifficultyRate.Hard) {
        return new Date(now.getTime() + 30 * ONE_MINUTE_IN_MS);
      }

      if (difficultyLevel === UserDifficultyRate.VeryHard) {
        return new Date(now.getTime() + 5 * ONE_MINUTE_IN_MS);
      }

      const diffTimeInHours = () => {
        if (nextReviewAt > now)
          return dateDiffInHours(nextReviewAt, lastReviewAt);

        return dateDiffInHours(now, lastReviewAt);
      };

      const getTotalInterval = () => {
        if (diffTimeInHours() > ONE_DAY_IN_HOURS) {
          return (
            diffTimeInHours() *
            ONE_HOUR_IN_MS *
            difficultyFactor[difficultyLevel]
          );
        }
        return (
          ONE_HOUR_IN_MS * ONE_DAY_IN_HOURS * difficultyFactor[difficultyLevel]
        );
      };

      return new Date(now.getTime() + getTotalInterval());
    };

    const newRates = [
      ...rates,
      {
        rate: difficultyLevel,
        reviewedAt: new Date().toISOString(),
      },
    ];

    await db
      .update(userLearningWords)
      .set({
        nextReviewAt: calculateNextReviewAt(),
        difficultyRate: newRates,
      })
      .where(eq(userLearningWords.id, data.learningWordId));

    return { success: true };
  });
