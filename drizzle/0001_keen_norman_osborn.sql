CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"external_id" text NOT NULL,
	"description" text NOT NULL,
	"thumbnails" jsonb NOT NULL,
	"published_at" timestamp,
	"duration" double precision NOT NULL,
	"view_count" text NOT NULL,
	"tags" text[],
	"channel" jsonb,
	"phrasal_verbs" text[],
	"idioms" text[],
	"level" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "external_id_idx" ON "videos" USING btree ("external_id");