// Messages are now stored in PostgreSQL via Drizzle
// See ~/db/schema.ts for the messages table definition

import { eq, desc } from "drizzle-orm";
import { db } from "~/db";
import { messages } from "~/db/schema";

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export async function getMessages(contactUid?: string) {
  if (contactUid) {
    return db
      .select()
      .from(messages)
      .where(eq(messages.contactUid, contactUid))
      .orderBy(desc(messages.timestamp));
  }
  return db.select().from(messages).orderBy(desc(messages.timestamp));
}

export async function getMessageById(id: string) {
  const result = await db
    .select()
    .from(messages)
    .where(eq(messages.id, id))
    .limit(1);
  return result[0];
}

export async function getLastSentMessage(contactUid: string) {
  const result = await db
    .select()
    .from(messages)
    .where(eq(messages.contactUid, contactUid))
    .where(eq(messages.direction, "OUT"))
    .orderBy(desc(messages.timestamp))
    .limit(1);
  return result[0];
}

export async function createMessage(message: NewMessage) {
  const result = await db.insert(messages).values(message).returning();
  return result[0];
}

export async function deleteMessage(id: string) {
  await db.delete(messages).where(eq(messages.id, id));
}
