/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourseFaculty, Faculty, Prisma } from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { facultySearchAbleFields } from './faculty.constant';
import { IFilters, IMyCourseStudentsPayload } from './faculty.interface';

const createFaculty = async (facultyData: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data: facultyData,
  });

  return result;
};

const getFaculties = async (
  filters: IFilters,
  options: IPageOptions
): Promise<IGenericResponse<Faculty[]>> => {
  // Pagination and Sorting
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const orCondition = [];
  const { searchTerm, ...filtersData } = filters;

  // Searching
  if (searchTerm) {
    orCondition.push({
      OR: facultySearchAbleFields.map(field => ({
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

  const whereCondition: Prisma.FacultyWhereInput = orCondition.length
    ? { AND: orCondition }
    : {};

  const result = await prisma.faculty.findMany({
    where: whereCondition,
    orderBy: { [sortBy]: sortOrder },
    skip: skip,
    take: limit,
  });
  const total = await prisma.faculty.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getFaculty = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: { id },
  });

  return result;
};

const updateFaculty = async (
  id: string,
  data: Partial<Faculty>
): Promise<Faculty | null> => {
  const result = await prisma.faculty.update({
    where: { id },
    data,
    include: {
      academicDepartment: true,
      academicFaculty: true,
    },
  });

  return result;
};

const deleteFaculty = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.delete({
    where: { id },
    include: {
      academicDepartment: true,
      academicFaculty: true,
    },
  });

  return result;
};

const assignCourses = async (
  id: string,
  payload: { courses: string[] }
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.courses.map(faculty => ({
      facultyId: id,
      courseId: faculty,
    })),
  });

  const result = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: { course: true },
  });

  return result;
};

const removeCourses = async (
  id: string,
  payload: { courses: string[] }
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.deleteMany({
    where: { facultyId: id, courseId: { in: payload.courses } },
  });

  const responseData = await prisma.courseFaculty.findMany({
    where: { facultyId: id },
    include: { course: true },
  });

  return responseData;
};

const myCourses = async (
  authUserId: string,
  filter: {
    academicSemesterId?: string | null | undefined;
    courseId?: string | null | undefined;
  }
) => {
  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    filter.academicSemesterId = currentSemester?.id;
  }

  const offeredCourseSections = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedules: {
        some: {
          faculty: {
            facultyId: authUserId,
          },
        },
      },
      offeredCourse: {
        semesterRegistration: {
          academicSemesterId: filter.academicSemesterId,
        },
      },
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
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
  });

  /* 
    ## Fortmat Data ##
      - Find unique course data with its sections (section + schedule)
      - Sample Data:
        [
          course: {
            ...
            sections: [
              section: { ... }, -> offeredCourseSection
              classSchedues: [ ... ] -> classSchedules[]
            ]
          }
        ]
  */
  const courseAndSchedules = offeredCourseSections.reduce(
    (acc: any, offeredCourseSection: any) => {
      const course = offeredCourseSection.offeredCourse.course;
      const classSchedules = offeredCourseSection.offeredCourseClassSchedules;

      const existingCourse = acc.find(
        (item: any) => item.course?.id === course?.id
      );

      if (existingCourse) {
        existingCourse.sections.push({
          section: offeredCourseSection,
          classSchedules,
        });
      } else {
        acc.push({
          course,
          sections: [
            {
              section: offeredCourseSection,
              classSchedules,
            },
          ],
        });
      }

      return acc;
    },
    []
  );

  return courseAndSchedules;
};

const myCourseStudents = async (
  filters: IMyCourseStudentsPayload,
  options: IPageOptions
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  if (!filters.academicSemesterId) {
      const currentAcademicSemester = await prisma.academicSemester.findFirst({
          where: {
              isCurrent: true
          }
      });

      if (currentAcademicSemester) {
          filters.academicSemesterId = currentAcademicSemester.id;
      }
  }

  const offeredCourseSections = await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
          offeredCourse: {
              course: {
                  id: filters.courseId
              }
          },
          offeredCourseSection: {
              offeredCourse: {
                  semesterRegistration: {
                      academicSemester: {
                          id: filters.academicSemesterId
                      }
                  }
              },
              id: filters.offeredCourseSectionId
          }
      },
      include: {
          student: true
      },
      take: limit,
      skip
  });

  const students = offeredCourseSections.map(
      (offeredCourseSection) => offeredCourseSection.student
  );

  const total = await prisma.studentSemesterRegistrationCourse.count({
      where: {
          offeredCourse: {
              course: {
                  id: filters.courseId
              }
          },
          offeredCourseSection: {
              offeredCourse: {
                  semesterRegistration: {
                      academicSemester: {
                          id: filters.academicSemesterId
                      }
                  }
              },
              id: filters.offeredCourseSectionId
          }
      }
  });

  return {
      meta: {
          total,
          page,
          limit
      },
      data: students
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createFacultyEvent = async (catched: any) => {
  const facultyData: Partial<Faculty> = {
    facultyId: catched.id,
    firstName: catched.name.firstName,
    lastName: catched.name.lastName,
    middleName: catched.name.middleName,
    email: catched.email,
    contactNo: catched.contactNo,
    designation: catched.designation,
    gender: catched.gender,
    bloodgroup: catched.bloodGroup,
    academicDepartmentId: catched.academicDepartment.syncId,
    academicFacultyId: catched.academicFaculty.syncId,
  };

  await createFaculty(facultyData as Faculty);
};

const updateFacultyEvent = async (catched: any) => {
  const isExist = await prisma.faculty.findFirst({
    where: {
      facultyId: catched.id,
    },
  });

  if (!isExist) {
    createFacultyEvent(catched);
  } else {
    const facultyData: Partial<Faculty> = {
      facultyId: catched.id,
      firstName: catched.firstName,
      lastName: catched.lastName,
      middleName: catched.middleName,
      profileImage: catched.profileImage,
      email: catched.email,
      contactNo: catched.contactNo,
      gender: catched.gender,
      bloodgroup: catched.bloodGroup,
      designation: catched.designation,
      academicDepartmentId: catched.academicDepartment.syncId,
      academicFacultyId: catched.academicFaculty.syncId,
    };

    await prisma.faculty.updateMany({
      where: {
        facultyId: catched.id,
      },
      data: facultyData,
    });
  }
};

const deleteFacultyEvent = async (catched: any) => {
  await prisma.faculty.deleteMany({
    where: {
      facultyId: catched.id,
    },
  });
};

export const FacultyServices = {
  createFaculty,
  getFaculties,
  getFaculty,
  updateFaculty,
  deleteFaculty,
  assignCourses,
  removeCourses,
  myCourses,
  myCourseStudents,
  updateFacultyEvent,
  deleteFacultyEvent,
  createFacultyEvent,
};
