/*
  Warnings:

  - Added the required column `academicSemesterId` to the `semester_registrations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "semester_registrations" ADD COLUMN     "academicSemesterId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'UPCOMING';

-- AddForeignKey
ALTER TABLE "semester_registrations" ADD CONSTRAINT "semester_registrations_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
