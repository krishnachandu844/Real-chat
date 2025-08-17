/*
  Warnings:

  - You are about to drop the column `delivered` on the `Chat` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Sent', 'Seen');

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "delivered",
ADD COLUMN     "Status" "Status" NOT NULL DEFAULT 'Sent';
