-- CreateEnum
CREATE TYPE "public"."notificationType" AS ENUM ('MESSAGE', 'COMMENT', 'LIKE', 'REQUEST_FOLLOW', 'REQUEST_ACCEPT');

-- CreateTable
CREATE TABLE "public"."notification" (
    "id" SERIAL NOT NULL,
    "type" "public"."notificationType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "triggerById" INTEGER NOT NULL,
    "postdId" INTEGER,
    "messageId" INTEGER,
    "commentId" INTEGER,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_triggerById_fkey" FOREIGN KEY ("triggerById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
