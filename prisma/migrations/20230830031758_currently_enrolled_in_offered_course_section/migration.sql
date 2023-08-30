/*
  Warnings:

  - You are about to drop the column `curretnlyEnrolled` on the `offered_course_sections` table. All the data in the column will be lost.
  - Added the required column `currentlyEnrolled` to the `offered_course_sections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "offered_course_sections" DROP COLUMN "curretnlyEnrolled",
ADD COLUMN     "currentlyEnrolled" INTEGER NOT NULL;
