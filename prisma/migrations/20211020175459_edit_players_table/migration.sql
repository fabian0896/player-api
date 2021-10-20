/*
  Warnings:

  - You are about to drop the column `picture` on the `players` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "players" DROP COLUMN "picture",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "small" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "large" TEXT NOT NULL,
    "player_id" INTEGER NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "images_player_id_key" ON "images"("player_id");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
