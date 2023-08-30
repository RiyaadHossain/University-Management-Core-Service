import { Prisma, OfferedCourseSection } from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { offeredCourseSectionSearchAbleFields } from './offeredCourseSection.constant';
import { IFilters } from './offeredCourseSection.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createOfferedCourseSection = async (
  payload: OfferedCourseSection
): Promise<OfferedCourseSection> => {
  const offerCourse = await prisma.offeredCourse.findUnique({
    where: {
      id: payload.offeredCourseId,
    },
  });

  if (!offerCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Offer course doest not exist!');
  }

  const offeredCourseSectionData = {
    ...payload,
    semesterRegistrationId: offerCourse.semesterRegistrationId,
  };

  const result = await prisma.offeredCourseSection.create({
    data: offeredCourseSectionData,
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });

  return result;
};

const getOfferedCourseSections = async (
  filters: IFilters,
  options: IPageOptions
): Promise<IGenericResponse<OfferedCourseSection[]>> => {
  // Pagination and Sorting
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const orCondition = [];
  const { searchTerm, ...filtersData } = filters;

  // Searching
  if (searchTerm) {
    orCondition.push({
      OR: offeredCourseSectionSearchAbleFields.map(field => ({
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

  const whereCondition: Prisma.OfferedCourseSectionWhereInput =
    orCondition.length ? { AND: orCondition } : {};

  const result = await prisma.offeredCourseSection.findMany({
    where: whereCondition,
    orderBy: { [sortBy]: sortOrder },
    skip: skip,
    take: limit,
  });
  const total = await prisma.offeredCourseSection.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getOfferedCourseSection = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.findUnique({
    where: { id },
  });

  return result;
};

const updateOfferedCourseSection = async (
  id: string,
  data: Partial<OfferedCourseSection>
): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.update({
    where: { id },
    data,
  });

  return result;
};

const deleteOfferedCourseSection = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.delete({
    where: { id },
  });

  return result;
};

export const OfferedCourseSectionServices = {
  createOfferedCourseSection,
  getOfferedCourseSections,
  getOfferedCourseSection,
  updateOfferedCourseSection,
  deleteOfferedCourseSection,
};
