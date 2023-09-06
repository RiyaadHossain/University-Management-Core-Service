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
import { studentSemesterRegistrationCourseServices } from '../studentSemesterRegistrationCourse/studentSemesterRegistrationCourse.services';
import { asyncForEach } from '../../../shared/utils';

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
): Promise<{
  message: string;
}> => {
  return studentSemesterRegistrationCourseServices.enrollIntoCourse(
    authStudentId,
    payload
  );
};

const withdrawFromCourse = async (
  authStudentId: string,
  payload: IStudentEnrollPayload
): Promise<{
  message: string;
}> => {
  return studentSemesterRegistrationCourseServices.withdrawFromCourse(
    authStudentId,
    payload
  );
};

const confirmMyRegistration = async (authStudentId: string) => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No registration is ongoing!');
  }

  const studentSemesterReg = await prisma.studentSemesterRegistration.findFirst(
    {
      where: {
        student: {
          id: authStudentId,
        },
        semesterRegistration: {
          id: semesterRegistration.id,
        },
      },
    }
  );

  if (!studentSemesterReg) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'No Student Semester Registration data found!'
    );
  }

  if (!studentSemesterReg.totalCreditsTaken) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Student didn't enroll into courses!"
    );
  }

  const { minCredit, maxCredit } = semesterRegistration;
  if (
    studentSemesterReg.totalCreditsTaken < minCredit ||
    studentSemesterReg.totalCreditsTaken > maxCredit
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Student credits must be ${minCredit} to ${maxCredit}!`
    );
  }

  const data = await prisma.studentSemesterRegistration.updateMany({
    where: {
      semesterRegistration: {
        id: semesterRegistration.id,
      },
      student: {
        id: authStudentId,
      },
    },
    data: {
      isConfirmed: true,
    },
  });

  return data;
};

const getMyRegistration = async (authStudentId: string) => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
    include: {
      academicSemester: true,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No registration is ongoing!');
  }

  const studentSemesterReg = await prisma.studentSemesterRegistration.findFirst(
    {
      where: {
        student: {
          id: authStudentId,
        },
        semesterRegistration: {
          id: semesterRegistration.id,
        },
      },
      include: {
        student: true,
      },
    }
  );

  if (!studentSemesterReg) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'No Student Semester Registration data found!'
    );
  }

  return { semesterRegistration, studentSemesterReg };
};

const startNewRegistration = async (semesterRegId: string) => {
  const semesterReg = await prisma.semesterRegistration.findUnique({
    where: {
      id: semesterRegId,
    },
    include: {
      academicSemester: true,
    },
  });

  if (!semesterReg) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Semester Registration data not found!'
    );
  }

  const { academicSemester } = semesterReg;

  if (semesterReg.status !== SemesterRegistrationStatus.ENDED) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Semester Registration is not ended yet!'
    );
  }

  if (academicSemester.isCurrent) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Academic semester already started!'
    );
  }

  await prisma.$transaction(async transactionClient => {
    await transactionClient.academicSemester.updateMany({
      where: {
        isCurrent: true,
      },
      data: {
        isCurrent: false,
      },
    });

    await transactionClient.academicSemester.update({
      where: {
        id: academicSemester.id,
      },
      data: {
        isCurrent: true,
      },
    });

    const studentSemRegs = await prisma.studentSemesterRegistration.findMany({
      where: {
        semesterRegistration: {
          id: semesterRegId,
        },
        isConfirmed: true,
      },
    });

    asyncForEach(
      studentSemRegs,
      async (studentSemReg: StudentSemesterRegistration) => {
        const studentSemesterRegCourses =
          await prisma.studentSemesterRegistrationCourse.findMany({
            where: {
              semesterRegistration: {
                id: semesterRegId,
              },
              student: {
                id: studentSemReg.id,
              },
            },
          });

        // To be continued...
      }
    );
  });
};

export const SemesterRegistrationServices = {
  createSemesterRegistration,
  getSemesterRegistrations,
  getSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
  startMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewRegistration,
};
