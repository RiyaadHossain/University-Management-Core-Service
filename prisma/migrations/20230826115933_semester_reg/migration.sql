-- CreateEnum
CREATE TYPE "SemesterRegistrationStatus" AS ENUM ('UPCOMING', 'ONGOING', 'ENDED');

-- CreateTable
CREATE TABLE "semester_registrations" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "SemesterRegistrationStatus" NOT NULL,
    "minCredit" INTEGER NOT NULL,
    "maxCredit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "semester_registrations_pkey" PRIMARY KEY ("id")
);
