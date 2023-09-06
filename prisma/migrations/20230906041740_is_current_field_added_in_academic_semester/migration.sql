/*
  Warnings:

  - You are about to drop the column `isCurrent` on the `semester_registrations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "academic_semesters" ADD COLUMN     "isCurrent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "semester_registrations" DROP COLUMN "isCurrent";
