import {
  SemesterRegistration,
  Prisma,
  SemesterRegistrationStatus,
  StudentSemesterRegistration,
  StudentSemesterRegistrationCourse,
  OfferedCourse,
  Course,
  StudentEnrolledCourseStatus,
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
import { studentSemesterPaymentServices } from '../studentSemesterPayment/studentSemesterPayment.services';
import { studentEnrolledCourseMarkServices } from '../studentEnrolledCourseMark/studentEnrolledCourseMark.services';
import { SemesterRegistrationUtils } from './semesterRegistration.utils';

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

    /*     
      In a academic semester, 
       - For Every student semester regestration - create a 'studentSemesterPayment' data
       - For Every Students and every courses each student taken - create a 'studentEnrolledCourse' & 'studentEnrolledCourseMark' data
    */

    // 1. Find all 'Student Semester Registration' data
    const studentSemRegs =
      await transactionClient.studentSemesterRegistration.findMany({
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
        // 2. Create 'studentSemesterPayment' data
        if (studentSemReg.totalCreditsTaken) {
          const fullPaymentAmount = studentSemReg.totalCreditsTaken * 5000;
          const payload = {
            studentId: studentSemReg.studentId,
            academicSemesterId: academicSemester.id,
            fullPaymentAmount,
          };
          await studentSemesterPaymentServices.createStudentSemesterPayment(
            transactionClient,
            payload
          );
        }

        // 3. Find all 'Student Semester Registration Course' data
        const studentSemesterRegCourses =
          await transactionClient.studentSemesterRegistrationCourse.findMany({
            where: {
              semesterRegistration: {
                id: semesterRegId,
              },
              student: {
                id: studentSemReg.id,
              },
            },
            include: {
              offeredCourse: {
                include: { course: true },
              },
            },
          });

        asyncForEach(
          studentSemesterRegCourses,
          async (
            item: StudentSemesterRegistrationCourse & {
              offeredCourse: OfferedCourse & {
                course: Course;
              };
            }
          ) => {
            const studentEnrolledCourseData = {
              studentId: item.studentId,
              courseId: item.offeredCourse.course.id,
              academicSemesterId: semesterReg.academicSemesterId,
            };

            // Validation: Check if 'Student Enrolled Course' data is already exist or not
            const studentEnrolledCourse =
              await transactionClient.studentEnrolledCourse.findFirst({
                where: studentEnrolledCourseData,
              });

            // 4. Create 'Student Enrolled Course' and  'Student Enrolled Course Mark' data for (Every Students + Every Courses they taken)
            if (!studentEnrolledCourse) {
              const studentEnrolledCourse =
                await transactionClient.studentEnrolledCourse.create({
                  data: studentEnrolledCourseData,
                });

              await studentEnrolledCourseMarkServices.createStudentEnrolledCourseMark(
                transactionClient,
                studentEnrolledCourse
              );
            }
          }
        );
      }
    );
  });
};

const getMySemesterRegCourses = async (authUserId: string) => {
  /*  
    Purpose: Fetch the courses in which the student can enroll.
    Technique: From OfferedCourses data -
          1. Completed Courses (Remove) 
          2. Prerequisite Not Fulfiled (Remove)
          3. Ongoing Courses, (Set Flag)
  */

  const student = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.UPCOMING,
          SemesterRegistrationStatus.ONGOING,
        ],
      },
    },
    include: {
      academicSemester: true,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'No semester registration found!'
    );
  }

  // 1. Fetch Completed Courses Data
  const studentCompletedCourse = await prisma.studentEnrolledCourse.findMany({
    where: {
      status: StudentEnrolledCourseStatus.COMPLETED,
      student: {
        id: student?.id,
      },
    },
    include: {
      course: true,
    },
  });

  // 2. Fetch Taken Courses Data
  const studentCurrentSemesterTakenCourse =
    await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
        student: {
          id: student?.id,
        },
        semesterRegistration: {
          id: semesterRegistration.id,
        },
      },
      include: {
        offeredCourse: true,
        offeredCourseSection: true,
      },
    });

  // 3. Fetch Offered Courses Data
  const offeredCourse = await prisma.offeredCourse.findMany({
    where: {
      semesterRegistration: {
        id: semesterRegistration.id,
      },
      academicDepartment: {
        id: student?.academicDepartmentId,
      },
    },
    include: {
      course: {
        include: {
          preRequisite: {
            include: {
              preRequisite: true,
            },
          },
        },
      },
      offeredCourseSections: {
        include: {
          offeredCourseClassSchedules: {
            include: {
              room: {
                include: {
                  building: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Calculation: Get all the available courses
  const availableCourses = SemesterRegistrationUtils.getAvailableCourses(
    offeredCourse,
    studentCompletedCourse,
    studentCurrentSemesterTakenCourse
  );

  return availableCourses;
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
  getMySemesterRegCourses,
};
