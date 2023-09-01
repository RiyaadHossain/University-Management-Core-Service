import { OfferedCourseClassSchedule } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { hasTimeConfilct } from '../../../shared/utils';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

export const checkRoomAvailability = async (
  data: OfferedCourseClassSchedule
) => {
  const alreadyBookedRoomOnDay =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: data.dayOfWeek,
        room: {
          id: data.roodId,
        },
      },
    });

  const existingSlots = alreadyBookedRoomOnDay.map(slot => ({
    dayOfWeek: slot.dayOfWeek,
    startTime: slot.startTime,
    endTime: slot.endTime,
  }));

  const newSlot = {
    dayOfWeek: data.dayOfWeek,
    startTime: data.startTime,
    endTime: data.endTime,
  };

  if (hasTimeConfilct(existingSlots, newSlot)) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Room is not available at ${data.startTime} -  ${data.endTime} time slot!`
    );
  }
};

export const checkFacultyAvailability = async (
  data: OfferedCourseClassSchedule
) => {
  const alreadyAssignedFacultyOnDay =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: data.dayOfWeek,
        faculty: {
          id: data.facultyId,
        },
      },
    });

  const existingSlots = alreadyAssignedFacultyOnDay.map(slot => ({
    dayOfWeek: slot.dayOfWeek,
    startTime: slot.startTime,
    endTime: slot.endTime,
  }));

  const newSlot = {
    dayOfWeek: data.dayOfWeek,
    startTime: data.startTime,
    endTime: data.endTime,
  };

  if (hasTimeConfilct(existingSlots, newSlot)) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Faculty is not available at ${data.startTime} -  ${data.endTime} time slot!`
    );
  }
};
