import {
  ExamType,
  Prisma,
  PrismaClient,
  StudentEnrolledCourse,
  StudentEnrolledCourseStatus,
} from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { studentEnrolledCourseMarkUtils } from './studentEnrolledCourseMark.utils';
import {
  IUpdateFinalMarksPayload,
  IUpdateStudentMarksPayload,
} from './studentEnrolledCourseMark.interface';

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

const updateStudentMarks = async (payload: IUpdateStudentMarksPayload) => {
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

const updateFinalMarks = async (payload: IUpdateFinalMarksPayload) => {
  /* 
    Purpose: 
      1. Update 'StudentEnrolledCourse' - point, grade, totalMarks, status 
      2. Create 'StudentAcademicInfo'
  */

  const { academicSemesterId, courseId, studentId } = payload;

  // Find - StudentEnrolledCourse 
  const studentEnrolledCourse = await prisma.studentEnrolledCourse.findFirst({
    where: { academicSemesterId, courseId, studentId },
  });

  if (!studentEnrolledCourse) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Stduent Enrolled Course data not exist!'
    );
  }

  const studentEnrolledCourseMarks =
    await prisma.studentEnrolledCourseMark.findMany({
      where: {
        academicSemesterId,
        studentId,
        studentEnrolledCourse: {
          courseId,
        },
      },
    });

  if (!studentEnrolledCourseMarks.length) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Stduent Enrolled Course Marks data not exist!'
    );
  }

  // Calculate - totalMarks, grade, point
  const midTermMarks =
    studentEnrolledCourseMarks.find(mark => mark.examType === ExamType.MIDTERM)
      ?.marks || 0;
  const finalMarks =
    studentEnrolledCourseMarks.find(mark => mark.examType === ExamType.FINAL)
      ?.marks || 0;
  
  const totalMarks = midTermMarks * 0.4 + finalMarks * 0.6;

  const { grade, point } =
    studentEnrolledCourseMarkUtils.getGradeFromMarks(totalMarks);

  // Transaction - Update StudentEnrolledCourse + Create StudentAcademicInfo
  const updatedStudentEnrolledCourse = await prisma.$transaction(
    async transactionClient => {
        // Update - StudentEnrolledCourse
      await transactionClient.studentEnrolledCourse.updateMany({
        where: {
          studentId,
          academicSemesterId,
          courseId,
        },
        data: {
          grade,
          point,
          totalMarks,
          status: StudentEnrolledCourseStatus.COMPLETED,
        },
      });

      const updatedStudentEnrolledCourseClient =
        await transactionClient.studentEnrolledCourse.findMany({
          where: {
            studentId,
            academicSemesterId,
            courseId,
          },
          include: { course: true },
        });

      // Calculate - totalCompletedCredit, cgpa
      const { totalCompletedCredit, cgpa } =
        studentEnrolledCourseMarkUtils.calcCGPAandGrade(
          updatedStudentEnrolledCourseClient
        );

      // Create or Update - StudentAcademicInfo
      const studentAcademicInfo =
        await transactionClient.studentAcademicInfo.findFirst({
          where: {
            student: {
              id: studentId,
            },
          },
        });

      if (studentAcademicInfo) {
        await transactionClient.studentAcademicInfo.update({
          where: {
            id: studentAcademicInfo.id,
          },
          data: {
            totalCompletedCredit,
            cgpa,
          },
        });
      } else {
        await transactionClient.studentAcademicInfo.create({
          data: {
            student: {
              connect: {
                id: studentId,
              },
            },
            totalCompletedCredit,
            cgpa,
          },
        });
      }

      return updatedStudentEnrolledCourseClient;
    }
  );

  return updatedStudentEnrolledCourse;
};

export const studentEnrolledCourseMarkServices = {
  createStudentEnrolledCourseMark,
  updateStudentMarks,
  updateFinalMarks,
};
