import { AcademicDepartment, Prisma } from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import {
  EVENT_ACADEMIC_DEPARTMENT_CREATE,
  EVENT_ACADEMIC_DEPARTMENT_DELETE,
  EVENT_ACADEMIC_DEPARTMENT_UPDATE,
  academicDepartmentsSearchAbleFields,
} from './academicDepartment.constant';
import { IFilters } from './academicDepartment.interface';
import { RedisClient } from '../../../shared/redis';

const createAcademicDepartment = async (
  academicDepartmentData: AcademicDepartment
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.create({
    data: academicDepartmentData,
  });

  if (result) {
    RedisClient.publish(
      EVENT_ACADEMIC_DEPARTMENT_CREATE,
      JSON.stringify(result)
    );
  }

  return result;
};

const getAcademicDepartments = async (
  filters: IFilters,
  options: IPageOptions
): Promise<IGenericResponse<AcademicDepartment[]>> => {
  // Pagination and Sorting
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const orCondition = [];
  const { searchTerm, ...filtersData } = filters;

  // Searching
  if (searchTerm) {
    orCondition.push({
      OR: academicDepartmentsSearchAbleFields.map(field => ({
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

  const whereCondition: Prisma.AcademicDepartmentWhereInput = orCondition.length
    ? { AND: orCondition }
    : {};

  const result = await prisma.academicDepartment.findMany({
    where: whereCondition,
    orderBy: { [sortBy]: sortOrder },
    skip: skip,
    take: limit,
  });
  const total = await prisma.academicDepartment.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getAcademicDepartment = async (
  id: string
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.findUnique({
    where: { id },
  });

  return result;
};

const updateAcademicDepartment = async (
  id: string,
  data: Partial<AcademicDepartment>
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.update({
    where: { id },
    data,
  });

  if (result) {
    RedisClient.publish(
      EVENT_ACADEMIC_DEPARTMENT_UPDATE,
      JSON.stringify(result)
    );
  }

  return result;
};

const deleteAcademicDepartment = async (
  id: string
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.delete({
    where: { id },
  });

  if (result) {
    RedisClient.publish(
      EVENT_ACADEMIC_DEPARTMENT_DELETE,
      JSON.stringify(result)
    );
  }

  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartment,
  getAcademicDepartments,
  getAcademicDepartment,
  updateAcademicDepartment,
  deleteAcademicDepartment,
};
