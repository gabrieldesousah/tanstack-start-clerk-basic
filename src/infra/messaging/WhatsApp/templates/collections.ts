// WhatsApp templates are now stored in PostgreSQL via Drizzle
// See ~/db/schema.ts for the whatsappTemplates table definition

import { eq } from "drizzle-orm";
import { db } from "~/db";
import { whatsappTemplates } from "~/db/schema";

export type WhatsAppTemplate = typeof whatsappTemplates.$inferSelect;
export type NewWhatsAppTemplate = typeof whatsappTemplates.$inferInsert;

export async function getWhatsAppTemplates() {
  return db.select().from(whatsappTemplates);
}

export async function getWhatsAppTemplateByName(name: string) {
  const result = await db
    .select()
    .from(whatsappTemplates)
    .where(eq(whatsappTemplates.name, name))
    .limit(1);
  return result[0];
}

export async function createWhatsAppTemplate(template: NewWhatsAppTemplate) {
  const result = await db
    .insert(whatsappTemplates)
    .values(template)
    .returning();
  return result[0];
}

export async function updateWhatsAppTemplate(
  id: string,
  updates: Partial<NewWhatsAppTemplate>,
) {
  const result = await db
    .update(whatsappTemplates)
    .set(updates)
    .where(eq(whatsappTemplates.id, id))
    .returning();
  return result[0];
}

export async function deleteWhatsAppTemplate(id: string) {
  await db.delete(whatsappTemplates).where(eq(whatsappTemplates.id, id));
}
