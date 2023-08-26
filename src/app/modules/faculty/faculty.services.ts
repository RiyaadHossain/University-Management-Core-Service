import { CourseFaculty, Faculty, Prisma } from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { facultySearchAbleFields } from './faculty.constant';
import { IFilters } from './faculty.interface';

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

export const FacultyServices = {
  createFaculty,
  getFaculties,
  getFaculty,
  updateFaculty,
  deleteFaculty,
  assignCourses,
  removeCourses,
};
