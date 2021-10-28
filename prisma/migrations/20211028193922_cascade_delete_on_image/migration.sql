-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_player_id_fkey";

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
