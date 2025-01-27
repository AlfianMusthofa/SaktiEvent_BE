/*
  Warnings:

  - You are about to drop the `Speaker` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "speaker_biography" TEXT,
ADD COLUMN     "speaker_image" TEXT,
ADD COLUMN     "speaker_name" TEXT,
ADD COLUMN     "speaker_position" TEXT,
ALTER COLUMN "date" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Speaker";
