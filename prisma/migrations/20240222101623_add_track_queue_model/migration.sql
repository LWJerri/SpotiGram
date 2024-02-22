-- CreateTable
CREATE TABLE "tracks_queue" (
    "id" TEXT NOT NULL,
    "trackUri" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracks_queue_pkey" PRIMARY KEY ("id")
);
