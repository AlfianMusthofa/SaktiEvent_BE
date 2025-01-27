/*
  Warnings:

  - You are about to drop the column `speaker_biography` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `speaker_image` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `speaker_name` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `speaker_position` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "speaker_biography",
DROP COLUMN "speaker_image",
DROP COLUMN "speaker_name",
DROP COLUMN "speaker_position";

-- CreateTable
CREATE TABLE "Speaker" (
    "id" SERIAL NOT NULL,
    "speakerName" TEXT,
    "speakerImage" TEXT,
    "speakerBiography" TEXT,
    "speakerPosition" TEXT,
    "eventId" INTEGER,

    CONSTRAINT "Speaker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Speaker" ADD CONSTRAINT "Speaker_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
