import { Prisma, OfferedCourse } from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { offeredCourseSearchAbleFields } from './offeredCourse.constant';
import { IFilters, IOfferedCourse } from './offeredCourse.interface';
import { asyncForEach } from '../../../shared/utils';

const createOfferedCourse = async (
  offeredCourseData: IOfferedCourse
): Promise<OfferedCourse[]> => {
  const result: OfferedCourse[] = [];

  const { courseIds, academicDepartmentId, semesterRegistrationId } =
    offeredCourseData;

  // Create OfferedCourse document with each courseId
  await asyncForEach(courseIds, async (courseId: string) => {
    const isExist = await prisma.offeredCourse.findFirst({
      where: {
        courseId,
        academicDepartmentId,
        semesterRegistrationId,
      },
    });

    if (!isExist) {
      const offeredCourse = await prisma.offeredCourse.create({
        data: {
          courseId,
          academicDepartmentId,
          semesterRegistrationId,
        },
        include: {
          course: true,
          academicDepartment: true,
          semesterRegistration: true,
        },
      });

      result.push(offeredCourse);
    }
  });

  return result;
};

const getOfferedCourses = async (
  filters: IFilters,
  options: IPageOptions
): Promise<IGenericResponse<OfferedCourse[]>> => {
  // Pagination and Sorting
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const orCondition = [];
  const { searchTerm, ...filtersData } = filters;

  // Searching
  if (searchTerm) {
    orCondition.push({
      OR: offeredCourseSearchAbleFields.map(field => ({
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

  const whereCondition: Prisma.OfferedCourseWhereInput = orCondition.length
    ? { AND: orCondition }
    : {};

  const result = await prisma.offeredCourse.findMany({
    where: whereCondition,
    orderBy: { [sortBy]: sortOrder },
    skip: skip,
    take: limit,
  });
  const total = await prisma.offeredCourse.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getOfferedCourse = async (id: string): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.findUnique({
    where: { id },
  });

  return result;
};

const updateOfferedCourse = async (
  id: string,
  data: Partial<OfferedCourse>
): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.update({
    where: { id },
    data,
  });

  return result;
};

const deleteOfferedCourse = async (
  id: string
): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.delete({
    where: { id },
  });

  return result;
};

export const OfferedCourseServices = {
  createOfferedCourse,
  getOfferedCourses,
  getOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
