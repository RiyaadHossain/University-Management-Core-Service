import { AcademicFaculty, Prisma } from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import {
  EVENT_ACADEMIC_FACULTY_CREATE,
  EVENT_ACADEMIC_FACULTY_DELETE,
  EVENT_ACADEMIC_FACULTY_UPDATE,
  academicFacultySearchAbleFields,
} from './academicFaculty.constant';
import { IFilters } from './academicFaculty.interface';
import { RedisClient } from '../../../shared/redis';

const createAcademicFaculty = async (
  academicFacultyData: AcademicFaculty
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.create({
    data: academicFacultyData,
  });

  if (result) {
    RedisClient.publish(EVENT_ACADEMIC_FACULTY_CREATE, JSON.stringify(result));
  }

  return result;
};

const getAcademicFaculties = async (
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

const updateAcademicFaculty = async (
  id: string,
  data: Partial<AcademicFaculty>
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.update({
    where: { id },
    data,
  });

  if (result) {
    RedisClient.publish(EVENT_ACADEMIC_FACULTY_UPDATE, JSON.stringify(result));
  }

  return result;
};

const deleteAcademicFaculty = async (
  id: string
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.delete({
    where: { id },
  });

  if (result) {
    RedisClient.publish(EVENT_ACADEMIC_FACULTY_DELETE, JSON.stringify(result));
  }

  return result;
};

export const AcademicFacultyServices = {
  createAcademicFaculty,
  getAcademicFaculties,
  getAcademicFaculty,
  updateAcademicFaculty,
  deleteAcademicFaculty,
};
