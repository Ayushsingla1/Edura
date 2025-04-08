/*
  Warnings:

  - The primary key for the `Courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `name` to the `Lecture` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lecture" DROP CONSTRAINT "Lecture_courseId_fkey";

-- AlterTable
ALTER TABLE "Courses" DROP CONSTRAINT "Courses_pkey",
ALTER COLUMN "courseId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Courses_pkey" PRIMARY KEY ("courseId");

-- AlterTable
ALTER TABLE "Lecture" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "courseId" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,

    CONSTRAINT "Purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Purchases_txHash_key" ON "Purchases"("txHash");

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;
