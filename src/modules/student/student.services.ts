import { Student, Prisma } from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../helpers/paginationHelper';
import { IGenericResponse } from '../../interfaces/common';
import prisma from '../../shared/prisma';
import { IFilters } from './student.interface';
import { studentSearchAbleFields } from './student.constant';

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

export const StudentServices = {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
};
