import { OfferedCourseClassSchedule, Prisma } from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { IFilters } from './offeredCourseClassSchedule.interface';
import {
  offeredCourseClassScheduleRelationalFieldsMapper,
  offeredCourseClassScheduleSearchAbleFields,
  offeredCourseClassScheduleRelationalFields,
} from './offeredCourseClassSchedule.constant';
import { OfferedCourseClassScheduleUtils } from './offeredCourseClassSchedule.utils';

const createOfferedCourseClassSchedule = async (
  offeredCourseClassScheduleData: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {
  await OfferedCourseClassScheduleUtils.checkRoomAvailability(offeredCourseClassScheduleData);
  await OfferedCourseClassScheduleUtils.checkFacultyAvailability(offeredCourseClassScheduleData);

  const result = prisma.offeredCourseClassSchedule.create({
    data: offeredCourseClassScheduleData,
  });

  return result;
};

const getOfferedCourseClassSchedules = async (
  filters: IFilters,
  options: IPageOptions
): Promise<IGenericResponse<OfferedCourseClassSchedule[]>> => {
  // Pagination and Sorting
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const orCondition = [];
  const { searchTerm, ...filtersData } = filters;

  // Searching
  if (searchTerm) {
    orCondition.push({
      OR: offeredCourseClassScheduleSearchAbleFields.map(field => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  // Filtering
  if (Object.keys(filtersData).length > 0) {
    orCondition.push({
      AND: Object.keys(filtersData).map(key => {
        if (offeredCourseClassScheduleRelationalFields.includes(key)) {
          return {
            [offeredCourseClassScheduleRelationalFieldsMapper[key]]: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              id: (filtersData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              equals: (filtersData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereCondition: Prisma.OfferedCourseClassScheduleWhereInput =
    orCondition.length ? { AND: orCondition } : {};

  const result = await prisma.offeredCourseClassSchedule.findMany({
    where: whereCondition,
    orderBy: { [sortBy]: sortOrder },
    skip: skip,
    take: limit,
  });
  const total = await prisma.offeredCourseClassSchedule.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getOfferedCourseClassSchedule = async (
  id: string
): Promise<OfferedCourseClassSchedule | null> => {
  const result = await prisma.offeredCourseClassSchedule.findUnique({
    where: { id },
  });

  return result;
};

const updateOfferedCourseClassSchedule = async (
  id: string,
  data: Partial<OfferedCourseClassSchedule>
): Promise<OfferedCourseClassSchedule | null> => {
  const result = await prisma.offeredCourseClassSchedule.update({
    where: { id },
    data,
  });

  return result;
};

const deleteOfferedCourseClassSchedule = async (
  id: string
): Promise<OfferedCourseClassSchedule | null> => {
  const result = await prisma.offeredCourseClassSchedule.delete({
    where: { id },
  });

  return result;
};

export const OfferedCourseClassScheduleServices = {
  createOfferedCourseClassSchedule,
  getOfferedCourseClassSchedules,
  getOfferedCourseClassSchedule,
  updateOfferedCourseClassSchedule,
  deleteOfferedCourseClassSchedule,
};
