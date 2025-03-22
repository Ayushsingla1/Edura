-- CreateTable
CREATE TABLE "educator" (
    "userId" TEXT NOT NULL,

    CONSTRAINT "educator_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Lecture" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "educatorId" TEXT NOT NULL,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Courses" (
    "courseId" INTEGER NOT NULL,
    "educatorId" TEXT NOT NULL,

    CONSTRAINT "Courses_pkey" PRIMARY KEY ("courseId")
);

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_educatorId_fkey" FOREIGN KEY ("educatorId") REFERENCES "educator"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
