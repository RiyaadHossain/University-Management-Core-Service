import { Prisma, Student, StudentEnrolledCourseStatus } from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { studentSearchAbleFields } from './student.constant';
import { EnrolledWithCourseNAcademicSem, IFilters } from './student.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { StudentUtils } from './student.utils';

const createStudent = async (studentData: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data: studentData,
  });

  return result;
};

const getStudents = async (
  filters: IFilters,
  options: IPageOptions
): Promise<IGenericResponse<Student[]>> => {
  // Pagination and Sorting
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const orCondition = [];
  const { searchTerm, ...filtersData } = filters;

  // Searching
  if (searchTerm) {
    orCondition.push({
      OR: studentSearchAbleFields.map(field => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  // Filtering
  if (Object.keys(filtersData).length) {
    orCondition.push({
      AND: Object.keys(filtersData).map(field => ({
        [field]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          equals: (filtersData as any)[field],
        },
      })),
    });
  }

  const whereCondition: Prisma.StudentWhereInput = orCondition.length
    ? { AND: orCondition }
    : {};

  const result = await prisma.student.findMany({
    where: whereCondition,
    orderBy: { [sortBy]: sortOrder },
    skip: skip,
    take: limit,
  });

  const total = await prisma.student.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getStudent = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: { id },
  });

  return result;
};

const updateStudent = async (
  id: string,
  data: Partial<Student>
): Promise<Student | null> => {
  const result = await prisma.student.update({
    where: { id },
    data,
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemeter: true,
    },
  });

  return result;
};

const deleteStudent = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.delete({
    where: { id },
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemeter: true,
    },
  });

  return result;
};

const getMyCourses = async (
  authUserId: string,
  filter: { academicSemesterId?: string; courseId?: string }
) => {
  if (!filter.academicSemesterId) {
    const currentAcademicSemester = await prisma.academicSemester.findFirst({
      where: { isCurrent: true },
    });

    if (!currentAcademicSemester) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No Semester is running!');
    }

    filter.academicSemesterId = currentAcademicSemester.id;
  }

  const result = await prisma.studentEnrolledCourse.findMany({
    where: {
      studentId: authUserId,
      ...filter,
    },
    include: {
      course: true,
    },
  });

  return result;
};

const getMyCoursesSchedules = async (
  authUserId: string,
  filter: { academicSemesterId?: string; courseId?: string }
) => {
  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });
    filter.academicSemesterId = currentSemester?.id;
  }

  const studentEnrolledCourses = await getMyCourses(authUserId, filter);
  const studentEnrolledCourseIds = studentEnrolledCourses.map(
    item => item.courseId
  );

  const result = await prisma.studentSemesterRegistrationCourse.findMany({
    where: {
      student: {
        studentId: authUserId,
      },
      semesterRegistration: {
        academicSemester: {
          id: filter.academicSemesterId,
        },
      },
      offeredCourse: {
        course: {
          id: {
            in: studentEnrolledCourseIds,
          },
        },
      },
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseSection: {
        include: {
          offeredCourseClassSchedules: {
            include: {
              room: {
                include: {
                  building: true,
                },
              },
              faculty: true,
            },
          },
        },
      },
    },
  });

  return result;
};

const getMyAcademicInfo = async (authUserId: string) => {
  const acadmicInfo = await prisma.studentAcademicInfo.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  const enrolledCourses: EnrolledWithCourseNAcademicSem[] =
    await prisma.studentEnrolledCourse.findMany({
      where: {
        studentId: authUserId,
        status: StudentEnrolledCourseStatus.COMPLETED,
      },
      include: {
        course: true,
        academicSemester: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

  // Group Academic Info
  const groupAcademicInfo = StudentUtils.groupAcademicInfo(enrolledCourses);

  return { acadmicInfo, courses: groupAcademicInfo };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createStudentEvent = async (catched: any) => {
  const studentData: Partial<Student> = {
    studentId: catched.id,
    firstName: catched.name.firstName,
    lastName: catched.name.lastName,
    middleName: catched.name.middleName,
    email: catched.email,
    contactNo: catched.contactNo,
    gender: catched.gender,
    bloodgroup: catched.bloodGroup,
    academicSemesterId: catched.academicSemester.syncId,
    academicDepartmentId: catched.academicDepartment.syncId,
    academicFacultyId: catched.academicFaculty.syncId,
  };

  await createStudent(studentData as Student);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateStudentEvent = async (catched: any) => {

  const isExist = await prisma.student.findFirst({
    where: {
      studentId: catched.id,
    },
  });

  if (!isExist) {
    createStudentEvent(catched);
  } else {
    const studentData: Partial<Student> = {
      studentId: catched.id,
      firstName: catched.firstName,
      lastName: catched.lastName,
      middleName: catched.middleName,
      profileImage: catched.profileImage,
      email: catched.email,
      contactNo: catched.contactNo,
      gender: catched.gender,
      bloodgroup: catched.bloodGroup,
      academicDepartmentId: catched.academicDepartment.syncId,
      academicFacultyId: catched.academicFaculty.syncId,
    };

    await prisma.student.updateMany({
      where: {
        studentId: catched.id,
      },
      data: studentData,
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteStudentEvent = async (catched: any) => {
  await prisma.student.deleteMany({
    where: {
      studentId: catched.id,
    },
  });
};

export const StudentServices = {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getMyCourses,
  getMyCoursesSchedules,
  getMyAcademicInfo,
  createStudentEvent,
  updateStudentEvent,
  deleteStudentEvent,
};
