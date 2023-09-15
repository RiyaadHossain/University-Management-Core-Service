import { ExamType } from '@prisma/client';

export type IUpdateStudentMarksPayload = {
  studentId: string;
  courseId: string;
  academicSemesterId: string;
  examType: ExamType;
  marks: number;
};

export type IUpdateFinalMarksPayload = {
  studentId: string;
  courseId: string;
  academicSemesterId: string;
};

export type MyMarksQueryData = {
  academicSemesterId?: string;
  courseId?: string;
}
