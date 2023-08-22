/*
  Warnings:

  - You are about to drop the column `name` on the `buildings` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `rooms` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[buidingName]` on the table `buildings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomName]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `buidingName` to the `buildings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomName` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "buildings_name_key";

-- DropIndex
DROP INDEX "rooms_name_key";

-- AlterTable
ALTER TABLE "buildings" DROP COLUMN "name",
ADD COLUMN     "buidingName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "name",
ADD COLUMN     "roomName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prerequisite" (
    "courseId" TEXT NOT NULL,
    "preRequisiteId" TEXT NOT NULL,

    CONSTRAINT "Prerequisite_pkey" PRIMARY KEY ("courseId","preRequisiteId")
);

-- CreateIndex
CREATE UNIQUE INDEX "buildings_buidingName_key" ON "buildings"("buidingName");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_roomName_key" ON "rooms"("roomName");

-- AddForeignKey
ALTER TABLE "Prerequisite" ADD CONSTRAINT "Prerequisite_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prerequisite" ADD CONSTRAINT "Prerequisite_preRequisiteId_fkey" FOREIGN KEY ("preRequisiteId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
