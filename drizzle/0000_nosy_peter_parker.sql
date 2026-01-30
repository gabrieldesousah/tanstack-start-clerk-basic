CREATE TABLE "captions" (
	"id" serial PRIMARY KEY NOT NULL,
	"video_id" text NOT NULL,
	"start" double precision NOT NULL,
	"dur" double precision NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "video_start_idx" ON "captions" USING btree ("video_id","start");