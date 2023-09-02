-- CreateTable
CREATE TABLE "StudentSemesterRegistration" (
    "id" TEXT NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "totalCreditsTaken" INTEGER NOT NULL DEFAULT 0,
    "semesterRegistrationId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentSemesterRegistration_id_key" ON "StudentSemesterRegistration"("id");

-- AddForeignKey
ALTER TABLE "StudentSemesterRegistration" ADD CONSTRAINT "StudentSemesterRegistration_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSemesterRegistration" ADD CONSTRAINT "StudentSemesterRegistration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
