import { Prisma, Course, CourseFaculty } from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { courseSearchAbleFields } from './course.constant';
import { ICourseData, IFilters, IPrerequisiteCourse } from './course.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { asyncForEach } from '../../../shared/utils';

const createCourse = async (data: ICourseData): Promise<Course | null> => {
  const { preRequisities, ...courseData } = data;
  const newCourse = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.create({
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create course');
    }

    if (preRequisities && preRequisities.length) {
      for (const course of preRequisities) {
        await transactionClient.prerequisite.create({
          data: { courseId: result.id, preRequisiteId: course.courseId },
        });
      }
    }

    return result;
  });

  if (!newCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create course');
  }

  const responseData = await prisma.course.findUnique({
    where: { id: newCourse.id },
    include: {
      preRequisite: {
        include: {
          course: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });

  return responseData;
};

const getCourses = async (
  filters: IFilters,
  options: IPageOptions
): Promise<IGenericResponse<Course[]>> => {
  // Pagination and Sorting
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const orCondition = [];
  const { searchTerm, ...filtersData } = filters;

  // Searching
  if (searchTerm) {
    orCondition.push({
      OR: courseSearchAbleFields.map(field => ({
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

  const whereCondition: Prisma.CourseWhereInput = orCondition.length
    ? { AND: orCondition }
    : {};

  const result = await prisma.course.findMany({
    where: whereCondition,
    orderBy: { [sortBy]: sortOrder },
    skip: skip,
    take: limit,
  });
  const total = await prisma.course.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getCourse = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.findUnique({
    where: { id },
    include: {
      preRequisite: {
        include: {
          course: true,
        },
      },
      preRequisiteFor: {
        include: {
          preRequisite: true,
        },
      },
    },
  });

  return result;
};

const updateCourse = async (
  id: string,
  data: Partial<ICourseData>
): Promise<Course | null> => {
  const { preRequisities, ...courseData } = data;

  await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.update({
      where: { id },
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }

    if (preRequisities && preRequisities.length) {
      const deletedPreRequisites = preRequisities.filter(
        preRequisite => preRequisite.isDeleted
      );
      const newPreRequisites = preRequisities.filter(
        preRequisite => !preRequisite.isDeleted
      );

      // Delete Prerequisite courses data
      await asyncForEach(
        deletedPreRequisites,
        async (preRequisiteCourse: IPrerequisiteCourse) => {
          await transactionClient.prerequisite.deleteMany({
            where: {
              AND: [
                { courseId: id },
                { preRequisiteId: preRequisiteCourse.courseId },
              ],
            },
          });
        }
      );

      // Create new Prerequisite courses data
      await asyncForEach(
        newPreRequisites,
        async (preRequisiteCourse: IPrerequisiteCourse) => {
          await transactionClient.prerequisite.create({
            data: {
              courseId: id,
              preRequisiteId: preRequisiteCourse.courseId,
            },
          });
        }
      );
    }
  });

  const responseData = await prisma.course.findUnique({
    where: { id },
    include: {
      preRequisite: {
        include: {
          course: true,
        },
      },
      preRequisiteFor: {
        include: {
          preRequisite: true,
        },
      },
    },
  });

  return responseData;
};

const deleteCourse = async (id: string): Promise<Course | null> => {

  const result = await prisma.$transaction(async transactionClient => {
    const deleted = await transactionClient.course.delete({
      where: { id }
    });

    if (!deleted) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete course');
    }

    const preRequisiteDeleted = await transactionClient.prerequisite.deleteMany(
      {
        where: {
          OR: [{ courseId: id }, { preRequisiteId: id }],
        },
      }
    );

    if (!preRequisiteDeleted) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete course');
    }

    return deleted;
  });

  return result;
};

const assignFaculties = async (
  id: string,
  payload: { faculties: string[] }
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.faculties.map(faculty => ({
      courseId: id,
      facultyId: faculty,
    })),
  });

  const result = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: { faculty: true, course: true },
  });

  return result;
};

const removeFaculties = async (
  id: string,
  payload: { faculties: string[] }
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.deleteMany({
    where: { courseId: id, facultyId: { in: payload.faculties } },
  });

  const responseData = await prisma.courseFaculty.findMany({
    where: { courseId: id },
    include: { faculty: true, course: true },
  });

  return responseData;
};

export const CourseServices = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  assignFaculties,
  removeFaculties,
};
