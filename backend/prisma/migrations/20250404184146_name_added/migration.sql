/*
  Warnings:

  - Added the required column `educatorName` to the `Courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Courses" ADD COLUMN     "educatorName" TEXT NOT NULL;
