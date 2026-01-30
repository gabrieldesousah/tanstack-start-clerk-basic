import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "~/db";
import { userLearningWords } from "~/db/schema";
import { z } from "zod";
import { getAuth } from "@clerk/tanstack-start/server";
import { getWebRequest } from "@tanstack/start/server";
import { dateDiffInHours } from "~/lib/dates";

export enum UserDifficultyRate {
	VeryEasy = '1',
	Easy = '2',
	Medium = '3',
	Hard = '4',
	VeryHard = '5',
}

const difficultyRateSchema = z.object({
    rate: z.nativeEnum(UserDifficultyRate),
    reviewedAt: z.string().transform(str => new Date(str)), // JSON stores dates as strings
});

export const createUserLearningWord = createServerFn({ method: "POST" })
  .validator((data: { wordId: string; nextReviewAt?: string; difficultyRate?: UserDifficultyRate }) => z.object({
      wordId: z.string(),
      nextReviewAt: z.string().optional(),
      difficultyRate: z.nativeEnum(UserDifficultyRate).optional(),
  }).parse(data))
  .handler(async ({ data }) => {
      const { userId } = await getAuth(getWebRequest());
      if (!userId) throw new Error("Unauthorized");

      const existing = await db.query.userLearningWords.findFirst({
          where: and(
              eq(userLearningWords.wordId, data.wordId),
              eq(userLearningWords.userId, userId)
          )
      });

      if (existing) {
          throw new Error("Word already saved");
      }

      const initialDifficulty = data.difficultyRate ? [{
          rate: data.difficultyRate,
          reviewedAt: new Date(), // Storing as Date object, Drizzle handles JSON serialization
      }] : [];

      await db.insert(userLearningWords).values({
          userId,
          wordId: data.wordId,
          difficultyRate: initialDifficulty as any, // Cast to any for JSONB
          nextReviewAt: data.nextReviewAt ? new Date(data.nextReviewAt) : new Date(),
      });

      return { success: true };
  });

export const updateDifficulty = createServerFn({ method: "POST" })
  .validator((data: { learningWordId: string; difficulty: string }) => z.object({
      learningWordId: z.string(),
      difficulty: z.string(),
  }).parse(data))
  .handler(async ({ data }) => {
      const { userId } = await getAuth(getWebRequest());
      if (!userId) throw new Error("Unauthorized");

      const learningWord = await db.query.userLearningWords.findFirst({
          where: eq(userLearningWords.id, data.learningWordId)
      });

      if (!learningWord) throw new Error("Word not found");

      // Logic from source...
      // Parse difficultyRate from JSON (if it comes as object/string, Drizzle returns it as object usually)
      const rates = (learningWord.difficultyRate as any[]) || [];
      const lastReviewAt = rates.length > 0 ? new Date(rates[rates.length - 1].reviewedAt) : undefined;
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
					diffTimeInHours() * ONE_HOUR_IN_MS * difficultyFactor[difficultyLevel]
				);
			}
			return (
				ONE_HOUR_IN_MS * ONE_DAY_IN_HOURS * difficultyFactor[difficultyLevel]
			);
		};

		return new Date(now.getTime() + getTotalInterval());
	};

     const newRates = [...rates, {
         rate: difficultyLevel,
         reviewedAt: new Date().toISOString(),
     }];

     await db.update(userLearningWords)
        .set({
            nextReviewAt: calculateNextReviewAt(),
            difficultyRate: newRates as any
        })
        .where(eq(userLearningWords.id, data.learningWordId));
        
     return { success: true };
  });
