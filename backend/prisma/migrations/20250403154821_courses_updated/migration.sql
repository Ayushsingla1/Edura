/*
  Warnings:

  - Added the required column `description` to the `Courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Courses" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;
