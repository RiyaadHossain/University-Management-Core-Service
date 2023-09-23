/*
  Warnings:

  - Added the required column `designation` to the `faculties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "faculties" ADD COLUMN     "designation" TEXT NOT NULL;
