import { AcademicFaculty, Prisma } from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../helpers/paginationHelper';
import { IGenericResponse } from '../../interfaces/common';
import prisma from '../../shared/prisma';
import { academicFacultySearchAbleFields } from './academicFaculty.constant';
import { IFilters } from './academicFaculty.interface';

const createAcademicFaculty = async (
  academicFacultyData: AcademicFaculty
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.create({
    data: academicFacultyData,
  });

  return result;
};

const getAcademicFacultys = async (
  filters: IFilters,
  options: IPageOptions
): Promise<IGenericResponse<AcademicFaculty[]>> => {
  // Pagination and Sorting
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const orCondition = [];
  const { searchTerm, ...filtersData } = filters;

  // Searching
  if (searchTerm) {
    orCondition.push({
      OR: academicFacultySearchAbleFields.map(field => ({
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

  const whereCondition: Prisma.AcademicFacultyWhereInput = orCondition.length
    ? { AND: orCondition }
    : {};

  const result = await prisma.academicFaculty.findMany({
    where: whereCondition,
    orderBy: { [sortBy]: sortOrder },
    skip: skip,
    take: limit,
  });
  const total = await prisma.academicFaculty.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getAcademicFaculty = async (
  id: string
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.findUnique({
    where: { id },
  });

  return result;
};

export const AcademicFacultyServices = {
  createAcademicFaculty,
  getAcademicFacultys,
  getAcademicFaculty,
};
