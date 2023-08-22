import { Prisma, Course } from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { courseSearchAbleFields } from './course.constant';
import { ICourseData, IFilters } from './course.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createCourse = async (data: ICourseData): Promise<Course | null> => {
  const { prerequisite, ...courseData } = data;

  const newCourse = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.create({
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create course');
    }

    if (prerequisite.length) {
      for (const course of prerequisite) {
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
  });

  return result;
};

const updateCourse = async (
  id: string,
  data: Partial<Course>
): Promise<Course | null> => {
  const result = await prisma.course.update({
    where: { id },
    data,
  });

  return result;
};

const deleteCourse = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.delete({
    where: { id },
  });

  return result;
};

export const CourseServices = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
};
