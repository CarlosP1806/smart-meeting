/*
  Warnings:

  - Added the required column `ownerId` to the `Meeting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accepted` to the `MeetingUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Meeting` ADD COLUMN `ownerId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `MeetingUser` ADD COLUMN `accepted` BOOLEAN NOT NULL;
