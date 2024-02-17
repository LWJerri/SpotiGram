import { date, pgTable, text } from "drizzle-orm/pg-core";

export const playlists = pgTable("playlists", {
  id: text("id").primaryKey(),
  snapshotId: text("snapshotId").notNull(),
});

export const tracks = pgTable("tracks", {
  id: text("id").primaryKey(),
  addedAt: date("addedAt").notNull(),
});
