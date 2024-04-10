/*
  Warnings:

  - You are about to drop the column `url` on the `VoiceRecord` table. All the data in the column will be lost.
  - Added the required column `filename` to the `VoiceRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `VoiceRecord` DROP COLUMN `url`,
    ADD COLUMN `filename` VARCHAR(191) NOT NULL;
