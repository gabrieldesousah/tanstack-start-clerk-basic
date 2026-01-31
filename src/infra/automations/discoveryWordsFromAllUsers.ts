import { eq, ne, notInArray, sql } from "drizzle-orm";

import { db } from "~/db";
import { userProfiles, userLearningWords, words } from "~/db/schema";

import { sendInteractiveMessage } from "~/infra/messaging/WhatsApp/sendInteractiveMessage";

type Word = typeof words.$inferSelect;

export const discoveryWordsFromAllUsers = async (limit = 10) => {
  // Get active users with WhatsApp phone
  const activeUsers = await db
    .select()
    .from(userProfiles)
    .where(ne(userProfiles.active, "false"));

  await Promise.all(
    activeUsers.map(async (user) => {
      const whatsappPhone = user.whatsappPhone;
      if (!whatsappPhone) return;
      console.log("whatsappPhone", whatsappPhone);

      // Get words not yet learned by this user
      const userWordIds = db
        .select({ wordId: userLearningWords.wordId })
        .from(userLearningWords)
        .where(eq(userLearningWords.userId, user.clerkUserId));

      const discoveryWords = await db
        .select()
        .from(words)
        .where(notInArray(words.id, userWordIds))
        .orderBy(sql`RANDOM()`)
        .limit(limit);

      const firstWord = discoveryWords.pop();
      if (!discoveryWords.length || !firstWord || !firstWord.id) {
        return;
      }

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
        text: `📝 New Vocabulary! 📝

🌟 *${enContent?.text}*

👇 What's the correct meaning? 👇`,
        phone: whatsappPhone,
        buttons: buttons.sort(() => Math.random() - 0.5),
      });
    }),
  );
};
