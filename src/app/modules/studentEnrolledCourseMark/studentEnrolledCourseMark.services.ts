import {
  ExamType,
  Prisma,
  PrismaClient,
  StudentEnrolledCourse,
} from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

const createStudentEnrolledCourseMark = async (
  transactionClient: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: StudentEnrolledCourse
) => {
  const isExist = await transactionClient.studentEnrolledCourseMark.findFirst({
    where: {
      studentId: payload.studentId,
      studentEnrolledCourseId: payload.id,
      academicSemesterId: payload.academicSemesterId,
    },
  });

  if (!isExist) {
    await transactionClient.studentEnrolledCourseMark.create({
      data: {
        studentId: payload.studentId,
        studentEnrolledCourseId: payload.id,
        academicSemesterId: payload.academicSemesterId,
        examType: ExamType.MIDTERM,
      },
    });

    await transactionClient.studentEnrolledCourseMark.create({
      data: {
        studentId: payload.studentId,
        studentEnrolledCourseId: payload.id,
        academicSemesterId: payload.academicSemesterId,
        examType: ExamType.FINAL,
      },
    });
  }
};

export const studentEnrolledCourseMarkServices = {
  createStudentEnrolledCourseMark,
};
