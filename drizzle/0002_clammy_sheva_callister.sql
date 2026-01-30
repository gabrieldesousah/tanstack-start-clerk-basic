CREATE TABLE "user_learning_words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"word_id" uuid NOT NULL,
	"difficulty_rate" jsonb,
	"next_review_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"en" jsonb,
	"pt" jsonb,
	"es" jsonb,
	"level" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "user_word_idx" ON "user_learning_words" USING btree ("user_id","word_id");