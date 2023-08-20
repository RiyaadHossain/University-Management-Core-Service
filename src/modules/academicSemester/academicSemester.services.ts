import { AcademicSemester, Prisma } from '@prisma/client';
import prisma from '../../shared/prisma';
import {
  IPageOptions,
  paginationHelpers,
} from '../../helpers/paginationHelper';
import { IGenericResponse } from '../../interfaces/common';
import { IFilters } from './academicSemester.interface';
import { academicSemestersSearchAbleFields } from './academicSemester.constant';

const createAcademicSemester = async (
  academicSemesterData: AcademicSemester
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({
    data: academicSemesterData,
  });

  return result;
};

const getAcademicSemesters = async (
  filters: IFilters,
  options: IPageOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  // Pagination and Sorting
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const orCondition = [];
  const { searchTerm, ...filtersData } = filters;

  // Searching
  if (searchTerm) {
    orCondition.push({
      OR: academicSemestersSearchAbleFields.map(field => ({
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

  const whereCondition: Prisma.AcademicSemesterWhereInput = orCondition.length
    ? { AND: orCondition }
    : {};

  const result = await prisma.academicSemester.findMany({
    where: whereCondition,
    orderBy: { [sortBy]: sortOrder },
    skip: skip,
    take: limit,
  });
  const total = await prisma.academicSemester.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getAcademicSemester = async (id: string): Promise<AcademicSemester | null> => {
  const result = await prisma.academicSemester.findUnique({
    where: { id },
  });

  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemester,
  getAcademicSemesters,
  getAcademicSemester,
};
