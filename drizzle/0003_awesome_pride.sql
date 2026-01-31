CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" text,
	"type" text NOT NULL,
	"active_message_type" text,
	"account_channel_uid" text NOT NULL,
	"direction" text NOT NULL,
	"contact_uid" text NOT NULL,
	"context" jsonb,
	"components" jsonb,
	"interactive" jsonb,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"whatsapp_phone" text,
	"whatsapp_last_sent_at" timestamp,
	"whatsapp_last_received_at" timestamp,
	"language_level" text,
	"active" text DEFAULT 'true',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"category" text NOT NULL,
	"language" text NOT NULL,
	"components" jsonb,
	"variables" text[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "contact_uid_idx" ON "messages" USING btree ("contact_uid");--> statement-breakpoint
CREATE INDEX "direction_idx" ON "messages" USING btree ("direction");--> statement-breakpoint
CREATE INDEX "clerk_user_id_idx" ON "user_profiles" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "whatsapp_phone_idx" ON "user_profiles" USING btree ("whatsapp_phone");