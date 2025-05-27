/*
  Warnings:

  - You are about to drop the column `value` on the `Counter` table. All the data in the column will be lost.
  - Added the required column `count` to the `Counter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Counter` DROP COLUMN `value`,
    ADD COLUMN `count` INTEGER NOT NULL;
