import {
  ExamType,
  Prisma,
  PrismaClient,
  StudentEnrolledCourse,
} from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { studentEnrolledCourseMarkUtils } from './studentEnrolledCourseMark.utils';
import { IStudentEnrolledCourseMarksPayload } from './studentEnrolledCourseMark.interface';

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

const updateStudentMarks = async (
  payload: IStudentEnrolledCourseMarksPayload
) => {
  const { studentId, academicSemesterId, courseId, examType, marks } = payload;

  const studentEnrolledCourseMarks =
    await prisma.studentEnrolledCourseMark.findFirst({
      where: {
        studentId,
        academicSemesterId,
        examType,
        studentEnrolledCourse: { courseId },
      },
    });

  if (!studentEnrolledCourseMarks) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student enrolled course marks not available!'
    );
  }

  const { grade } = studentEnrolledCourseMarkUtils.getGradeFromMarks(marks);

  await prisma.studentEnrolledCourseMark.update({
    where: {
      id: studentEnrolledCourseMarks.id,
    },
    data: {
      marks,
      grade,
    },
  });
};

export const studentEnrolledCourseMarkServices = {
  createStudentEnrolledCourseMark,
  updateStudentMarks,
};
