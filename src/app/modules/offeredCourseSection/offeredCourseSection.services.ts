import { OfferedCourseSection } from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import {
  IClassSchedule,
  IOfferedCourseSectionCreate,
} from './offeredCourseSection.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { OfferedCourseClassScheduleUtils } from '../offeredCourseClassSchedule/offeredCourseClassSchedule.utils';
import { asyncForEach } from '../../../shared/utils';

const createOfferedCourseSection = async (
  payload: IOfferedCourseSectionCreate
) => {
  const { classSchedules, ...data } = payload;

  const offeredCourse = await prisma.offeredCourse.findUnique({
    where: {
      id: data.offeredCourseId,
    },
  });

  if (!offeredCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Offer course doest not exist!');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await asyncForEach(classSchedules, async (schedule: any) => {
    await OfferedCourseClassScheduleUtils.checkRoomAvailability(schedule);
    await OfferedCourseClassScheduleUtils.checkFacultyAvailability(schedule);
  });

  const offeredCourseClassSection = await prisma.offeredCourseSection.findFirst(
    {
      where: {
        title: data.title,
        offeredCourseId: data.offeredCourseId,
      },
    }
  );

  if (offeredCourseClassSection) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Offered course class section is already exist'
    );
  }

  const createSection = await prisma.$transaction(async transactionClient => {
    const createSectionClient =
      await transactionClient.offeredCourseSection.create({
        data: {
          title: data.title,
          maxCapacity: data.maxCapacity,
          offeredCourseId: data.offeredCourseId,
          semesterRegistrationId: offeredCourse.semesterRegistrationId,
        },
        include: {
          offeredCourse: true,
          semesterRegistration: true,
        },
      });

    const scheduleData = classSchedules.map((schedule: IClassSchedule) => ({
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      dayOfWeek: schedule.dayOfWeek,
      roomId: schedule.roomId,
      facultyId: schedule.facultyId,
      offeredCourseSectionId: createSectionClient.id,
      semesterRegistrationId: offeredCourse.semesterRegistrationId,
    }));

    await transactionClient.offeredCourseClassSchedule.createMany({
      data: scheduleData,
    });

    return createSectionClient;
  });

  const result = await prisma.offeredCourseSection.findFirst({
    where: {
      id: createSection.id,
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true,
            },
          },
          faculty: true,
        },
      },
    },
  });

  return result;
};

const getOfferedCourseSections = async (
  options: IPageOptions
): Promise<IGenericResponse<OfferedCourseSection[]>> => {
  // Pagination and Sorting
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const result = await prisma.offeredCourseSection.findMany({
    where: {},
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
