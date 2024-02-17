CREATE TABLE IF NOT EXISTS "playlists" (
	"id" serial PRIMARY KEY NOT NULL,
	"snapshotId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tracks" (
	"id" serial PRIMARY KEY NOT NULL,
	"addedAt" date
);
