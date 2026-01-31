import { eq, ne, lte, notInArray, sql } from "drizzle-orm";

import { db } from "~/db";
import { userProfiles, userLearningWords, words } from "~/db/schema";

import { sendInteractiveMessage } from "~/infra/messaging/WhatsApp/sendInteractiveMessage";

type Word = typeof words.$inferSelect;

export const findTasksFromAllUsers = async (limit = 10) => {
  // Get active users with WhatsApp phone
  const activeUsers = await db
    .select()
    .from(userProfiles)
    .where(ne(userProfiles.active, "false"));

  await Promise.all(
    activeUsers.map(async (user) => {
      const whatsappPhone = user.whatsappPhone;
      if (!whatsappPhone) return;

      // Get words due for review (nextReviewAt <= now)
      const reviewWordsResult = await db
        .select({
          learningWord: userLearningWords,
          word: words,
        })
        .from(userLearningWords)
        .innerJoin(words, eq(userLearningWords.wordId, words.id))
        .where(eq(userLearningWords.userId, user.clerkUserId))
        .where(lte(userLearningWords.nextReviewAt, new Date()))
        .orderBy(userLearningWords.nextReviewAt)
        .limit(limit);

      const firstResult = reviewWordsResult.pop();
      if (!reviewWordsResult.length || !firstResult || !firstResult.word.id) {
        return;
      }

      const firstWord = firstResult.word;

      // Get random wrong words
      const wrongRandomWords = await db
        .select()
        .from(words)
        .where(notInArray(words.id, [firstWord.id]))
        .orderBy(sql`RANDOM()`)
        .limit(2);

      const enContent = firstWord.en as { text?: string } | undefined;
      const ptContent = firstWord.pt as { text?: string } | undefined;

      const buttons = wrongRandomWords.map((word: Word) => {
        const wordPt = word.pt as { text?: string } | undefined;
        return {
          type: "reply" as const,
          reply: { id: `QA#wrong#${word.id}`, title: wordPt?.text || "" },
        };
      });
      buttons.push({
        type: "reply" as const,
        reply: {
          id: `QA#correct#${firstWord.id}`,
          title: ptContent?.text || "",
        },
      });

      await sendInteractiveMessage({
        type: "button",
        text: `🔍 Word Review Time! 🔍

Remember this word?

🌟 *${enContent?.text}*

Did you get that right? Check your understanding:
👇 Tap the correct translation! 👇`,
        phone: whatsappPhone,
        buttons: buttons.sort(() => Math.random() - 0.5),
      });
    }),
  );
};
