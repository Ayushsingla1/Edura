/*
  Warnings:

  - The primary key for the `Courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Courses` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Courses` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Courses` table. All the data in the column will be lost.
  - The `courseId` column on the `Courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `txHash` on the `Purchases` table. All the data in the column will be lost.
  - You are about to drop the `educator` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `courseId` on the `Lecture` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `amount` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `courseId` on the `Purchases` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Courses" DROP CONSTRAINT "Courses_educatorId_fkey";

-- DropForeignKey
ALTER TABLE "Lecture" DROP CONSTRAINT "Lecture_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Purchases" DROP CONSTRAINT "Purchases_courseId_fkey";

-- DropIndex
DROP INDEX "Purchases_txHash_key";

-- AlterTable
ALTER TABLE "Courses" DROP CONSTRAINT "Courses_pkey",
DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "price",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "courseId",
ADD COLUMN     "courseId" SERIAL NOT NULL,
ADD CONSTRAINT "Courses_pkey" PRIMARY KEY ("courseId");

-- AlterTable
ALTER TABLE "Lecture" DROP COLUMN "courseId",
ADD COLUMN     "courseId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Purchases" DROP COLUMN "txHash",
ADD COLUMN     "amount" BIGINT NOT NULL,
DROP COLUMN "courseId",
ADD COLUMN     "courseId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT,
ADD COLUMN     "payout" BIGINT NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "educator";

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_educatorId_fkey" FOREIGN KEY ("educatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
