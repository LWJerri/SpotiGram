-- CreateTable
CREATE TABLE "playlists" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracks" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracks_queue" (
    "id" TEXT NOT NULL,
    "trackUri" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracks_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "playlists_id_key" ON "playlists"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_queue_trackUri_key" ON "tracks_queue"("trackUri");
