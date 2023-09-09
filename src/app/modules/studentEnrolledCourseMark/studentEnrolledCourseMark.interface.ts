import { ExamType } from "@prisma/client";

export type IStudentEnrolledCourseMarksPayload = {
  studentId: string;
  courseId: string;
  academicSemesterId: string;
  examType: ExamType;
  marks: number;
};
