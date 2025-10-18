/*
  Warnings:

  - You are about to drop the column `postdId` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Notification" DROP COLUMN "postdId",
ADD COLUMN     "postId" INTEGER;
