import {
  SemesterRegistration,
  Prisma,
  SemesterRegistrationStatus,
} from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { IFilters } from './semesterRegistration.interface';
import { semesterRegistrationSearchAbleFields } from './semesterRegistration.constant';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createSemesterRegistration = async (
  semesterRegistrationData: SemesterRegistration
): Promise<SemesterRegistration> => {
  // Business Logic
  const semesterExist = await prisma.semesterRegistration.findFirst({
    where: {
      OR: [
        { status: SemesterRegistrationStatus.UPCOMING },
        { status: SemesterRegistrationStatus.ONGOING },
      ],
    },
  });

  if (semesterExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an semster ${semesterExist.status}!`
    );
  }

  const result = await prisma.semesterRegistration.create({
    data: semesterRegistrationData,
  });

  return result;
};

const getSemesterRegistrations = async (
  filters: IFilters,
  options: IPageOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  // Pagination and Sorting
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const orCondition = [];
  const { searchTerm, ...filtersData } = filters;

  // Searching
  if (searchTerm) {
    orCondition.push({
      OR: semesterRegistrationSearchAbleFields.map(field => ({
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

  const whereCondition: Prisma.SemesterRegistrationWhereInput =
    orCondition.length ? { AND: orCondition } : {};

  const result = await prisma.semesterRegistration.findMany({
    where: whereCondition,
    orderBy: { [sortBy]: sortOrder },
    skip: skip,
    take: limit,
  });
  const total = await prisma.semesterRegistration.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration | null> => {
  const result = await prisma.semesterRegistration.findUnique({
    where: { id },
  });

  return result;
};

const updateSemesterRegistration = async (
  id: string,
  data: Partial<SemesterRegistration>
): Promise<SemesterRegistration | null> => {
  const isExist = await prisma.semesterRegistration.findUnique({
    where: {
      id: id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No data found!');
  }

  if (data.status && isExist.status === SemesterRegistrationStatus.UPCOMING && data.status !== SemesterRegistrationStatus.ONGOING) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Semester status can only be updated UPCOMING to ONGOING")
  }

  if (data.status && isExist.status === SemesterRegistrationStatus.ONGOING && data.status !== SemesterRegistrationStatus.ENDED) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Semester status can only be updated ONGOING to ENDED")
  }

  const result = await prisma.semesterRegistration.update({
    where: { id },
    data,
  });

  return result;
};

const deleteSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration | null> => {
  const result = await prisma.semesterRegistration.delete({
    where: { id },
  });

  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistration,
  getSemesterRegistrations,
  getSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
};
