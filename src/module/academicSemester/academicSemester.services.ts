import { AcademicSemester } from '@prisma/client';
import prisma from '../../shared/prisma';
import {
  IPageOptionsResult,
  paginationHelpers,
} from '../../helpers/paginationHelper';
import { IGenericResponse } from '../../interfaces/common';

const createAcademicSemester = async (
  academicSemesterData: AcademicSemester
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({
    data: academicSemesterData,
  });

  return result;
};

const getAcademicSemesters = async (
  /* filters, */ options: IPageOptionsResult
): Promise<IGenericResponse<AcademicSemester[]>> => {
  // Pagination and Sorting
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const result = await prisma.academicSemester.findMany({
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

export const AcademicSemesterServices = {
  createAcademicSemester,
  getAcademicSemesters,
};
