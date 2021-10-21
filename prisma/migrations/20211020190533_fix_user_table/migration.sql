/*
  Warnings:

  - You are about to drop the column `cedula` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cedula]` on the table `players` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cedula` to the `players` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_cedula_key";

-- AlterTable
ALTER TABLE "players" ADD COLUMN     "cedula" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "cedula";

-- CreateIndex
CREATE UNIQUE INDEX "players_cedula_key" ON "players"("cedula");
