import {
  SemesterRegistration,
  Prisma,
  SemesterRegistrationStatus,
  StudentSemesterRegistration,
} from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import {
  IFilters,
  IStudentEnrollPayload,
} from './semesterRegistration.interface';
import {
  semesterRegistrationRelationalFields,
  semesterRegistrationRelationalFieldsMapper,
  semesterRegistrationSearchableFields,
} from './semesterRegistration.constant';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createSemesterRegistration = async (
  semesterRegistrationData: SemesterRegistration
): Promise<SemesterRegistration> => {
  // Business Logic
  const semesterExist = await prisma.semesterRegistration.findFirst({
    where: {
      OR: [
        { status: SemesterRegistrationStatus.UPCOMING },
        { status: SemesterRegistrationStatus.ONGOING },
      ],
    },
  });

  if (semesterExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an semster ${semesterExist.status}!`
    );
  }

  const result = await prisma.semesterRegistration.create({
    data: semesterRegistrationData,
  });

  return result;
};

const getSemesterRegistrations = async (
  filters: IFilters,
  options: IPageOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  // Pagination and Sorting
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const orCondition = [];
  const { searchTerm, ...filterData } = filters;

  // Searching
  if (searchTerm) {
    orCondition.push({
      OR: semesterRegistrationSearchableFields.map(field => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  // Filtering
  if (Object.keys(filterData).length) {
    orCondition.push({
      AND: Object.keys(filterData).map(key => {
        if (semesterRegistrationRelationalFields.includes(key)) {
          return {
            [semesterRegistrationRelationalFieldsMapper[key]]: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereCondition: Prisma.SemesterRegistrationWhereInput =
    orCondition.length ? { AND: orCondition } : {};

  const result = await prisma.semesterRegistration.findMany({
    where: whereCondition,
    orderBy: { [sortBy]: sortOrder },
    skip: skip,
    take: limit,
  });
  const total = await prisma.semesterRegistration.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration | null> => {
  const result = await prisma.semesterRegistration.findUnique({
    where: { id },
  });

  return result;
};

const updateSemesterRegistration = async (
  id: string,
  data: Partial<SemesterRegistration>
): Promise<SemesterRegistration | null> => {
  const isExist = await prisma.semesterRegistration.findUnique({
    where: {
      id: id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No data found!');
  }

  if (
    data.status &&
    isExist.status === SemesterRegistrationStatus.UPCOMING &&
    data.status !== SemesterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Semester status can only be updated UPCOMING to ONGOING'
    );
  }

  if (
    data.status &&
    isExist.status === SemesterRegistrationStatus.ONGOING &&
    data.status !== SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Semester status can only be updated ONGOING to ENDED'
    );
  }

  const result = await prisma.semesterRegistration.update({
    where: { id },
    data,
  });

  return result;
};

const deleteSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration | null> => {
  const result = await prisma.semesterRegistration.delete({
    where: { id },
  });

  return result;
};

const startMyRegistration = async (
  studentId: string
): Promise<{
  semesterRegistrationInfo: SemesterRegistration | null;
  studentSemesterReg: StudentSemesterRegistration | null;
}> => {
  const studentInfo = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!studentInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Student record doesn't exist");
  }

  const semesterRegistrationInfo = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.ONGOING,
          SemesterRegistrationStatus.UPCOMING,
        ],
      },
    },
  });

  if (!semesterRegistrationInfo) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Semster Registration record doesn't exist"
    );
  }

  if (
    semesterRegistrationInfo?.status === SemesterRegistrationStatus.UPCOMING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Registration is not started yet'
    );
  }

  let studentSemesterReg: StudentSemesterRegistration | null =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        student: {
          id: studentId,
        },
        semesterRegistration: {
          id: semesterRegistrationInfo.id,
        },
      },
    });

  const data = {
    studentId,
    semesterRegistrationId: semesterRegistrationInfo.id,
  };

  if (!startMyRegistration) {
    studentSemesterReg = await prisma.studentSemesterRegistration.create({
      data,
    });
  }

  return { semesterRegistrationInfo, studentSemesterReg };
};

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

  const offeredCourse = await prisma.offeredCourse.findFirst({
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

export const SemesterRegistrationServices = {
  createSemesterRegistration,
  getSemesterRegistrations,
  getSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
  startMyRegistration,
  enrollIntoCourse,
};
