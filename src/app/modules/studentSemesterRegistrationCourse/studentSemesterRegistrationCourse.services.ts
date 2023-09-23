import { SemesterRegistrationStatus } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IStudentEnrollPayload } from '../semesterRegistration/semesterRegistration.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const enrollIntoCourse = async (
  authStudentId: string,
  payload: IStudentEnrollPayload
) => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: { status: SemesterRegistrationStatus.ONGOING },
  });

  const student = await prisma.student.findFirst({
    where: { studentId: authStudentId },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const offeredCourse: any = await prisma.offeredCourse.findFirst({
    where: { id: payload.offeredCourseId },
    include: { course: true },
  });

  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: { id: payload.offeredCourseSectionId },
  });

  // Validation
  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Semester Registration data not found!'
    );
  }

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student data not found!');
  }

  if (!offeredCourse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offered Course data not found!');
  }

  if (!offeredCourseSection) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Offered Course Section data not found!'
    );
  }

  const { maxCapacity, currentlyEnrolled } = offeredCourseSection;
  if (maxCapacity <= currentlyEnrolled) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Maximum section capacity exceeded!'
    );
  }

  await prisma.$transaction(async transactionClient => {
    // 1. Create StudentSemesterRegistrationCourse Data
    await transactionClient.studentSemesterRegistrationCourse.create({
      data: {
        semesterRegistrationId: semesterRegistration.id,
        studentId: student.id,
        offeredCourseId: payload.offeredCourseId,
        offeredCourseSectionId: payload.offeredCourseSectionId,
      },
    });

    // 2. Increment currentlyEnrolled field in OfferedCourseSection
    await transactionClient.offeredCourseSection.update({
      where: { id: offeredCourseSection.id },
      data: {
        currentlyEnrolled: {
          increment: 1,
        },
      },
    });

    // 3. Increment totalCreditsTaken field in StudentSemesterRegistration
    await transactionClient.studentSemesterRegistration.updateMany({
      where: {
        studentId: student.id,
        semesterRegistrationId: semesterRegistration.id,
      },
      data: { totalCreditsTaken: { increment: offeredCourse.course.credits } },
    });
  });

  return { message: 'Sutdent enrolled into the course Successfully.' };
};

const withdrawFromCourse = async (
  authStudentId: string,
  payload: IStudentEnrollPayload
) => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: { status: SemesterRegistrationStatus.ONGOING },
  });

  const student = await prisma.student.findFirst({
    where: { studentId: authStudentId },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const offeredCourse: any = await prisma.offeredCourse.findFirst({
    where: { id: payload.offeredCourseId },
    include: { course: true },
  });

  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: { id: payload.offeredCourseSectionId },
  });

  // Validation
  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Semester Registration data not found!'
    );
  }

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student data not found!');
  }

  if (!offeredCourse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offered Course data not found!');
  }

  if (!offeredCourseSection) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Offered Course Section data not found!'
    );
  }

  await prisma.$transaction(async transactionClient => {
    // 1. Delete StudentSemesterRegistrationCourse Data
    await transactionClient.studentSemesterRegistrationCourse.delete({
      where: {
        semesterRegistrationId_studentId_offeredCourseId: {
          semesterRegistrationId: semesterRegistration.id,
          studentId: student.id,
          offeredCourseId: payload.offeredCourseId,
        },
      },
    });

    // 2. Decrement currentlyEnrolled field in OfferedCourseSection
    await transactionClient.offeredCourseSection.update({
      where: { id: offeredCourseSection.id },
      data: {
        currentlyEnrolled: {
          decrement: 1,
        },
      },
    });

    // 3. Decrement totalCreditsTaken field in StudentSemesterRegistration
    await transactionClient.studentSemesterRegistration.updateMany({
      where: {
        studentId: student.id,
        semesterRegistrationId: semesterRegistration.id,
      },
      data: { totalCreditsTaken: { decrement: offeredCourse.course.credits } },
    });
  });

  return { message: 'Sutdent enrolled into the course Successfully.' };
};

export const studentSemesterRegistrationCourseServices = {
  enrollIntoCourse,
  withdrawFromCourse,
};
