/*
  Warnings:

  - You are about to drop the column `snapshotId` on the `playlists` table. All the data in the column will be lost.
  - You are about to drop the column `addedAt` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `trackId` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `addedAt` on the `tracks_queue` table. All the data in the column will be lost.
  - You are about to drop the column `trackUri` on the `tracks_queue` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[track_uri]` on the table `tracks_queue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `snapshot_id` to the `playlists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `track_id` to the `tracks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `track_uri` to the `tracks_queue` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "tracks_queue_trackUri_key";

-- AlterTable
ALTER TABLE "playlists" DROP COLUMN "snapshotId",
ADD COLUMN     "snapshot_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "addedAt",
DROP COLUMN "trackId",
ADD COLUMN     "added_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "track_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tracks_queue" DROP COLUMN "addedAt",
DROP COLUMN "trackUri",
ADD COLUMN     "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "track_uri" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tracks_queue_track_uri_key" ON "tracks_queue"("track_uri");
