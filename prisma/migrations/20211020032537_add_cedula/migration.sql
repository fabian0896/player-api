/*
  Warnings:

  - A unique constraint covering the columns `[cedula]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cedula` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cedula" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_cedula_key" ON "users"("cedula");
