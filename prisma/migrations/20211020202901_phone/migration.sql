/*
  Warnings:

  - Added the required column `phone` to the `players` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "players" ADD COLUMN     "phone" TEXT NOT NULL;
