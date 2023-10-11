import { OfferedCourseClassSchedule } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseClassScheduleServices } from './offeredCourseClassSchedule.services';
import { offeredCourseClassScheduleFilters } from './offeredCourseClassSchedule.constant';

const createOfferedCourseClassSchedule: RequestHandler = catchAsync(async (req, res) => {
  const result = await OfferedCourseClassScheduleServices.createOfferedCourseClassSchedule(req.body);
  sendResponse<OfferedCourseClassSchedule>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course created successfully.',
    data: result,
  });
});

const getOfferedCourseClassSchedules: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, offeredCourseClassScheduleFilters);
  const options = pick(req.query, paginationFields);

  const result = await OfferedCourseClassScheduleServices.getOfferedCourseClassSchedules(
    filters,
    options
  );

  sendResponse<OfferedCourseClassSchedule[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course fetched successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getOfferedCourseClassSchedule: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await OfferedCourseClassScheduleServices.getOfferedCourseClassSchedule(id);

  sendResponse<OfferedCourseClassSchedule>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course fetched successfully.',
    data: result,
  });
});

const updateOfferedCourseClassSchedule: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const offeredCourseClassScheduleData = req.body;

  const result = await OfferedCourseClassScheduleServices.updateOfferedCourseClassSchedule(
    id,
    offeredCourseClassScheduleData
  );

  sendResponse<OfferedCourseClassSchedule>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course updated successfully.',
    data: result,
  });
});

const deleteOfferedCourseClassSchedule: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await OfferedCourseClassScheduleServices.deleteOfferedCourseClassSchedule(id);

  sendResponse<OfferedCourseClassSchedule>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course deleted successfully.',
    data: result,
  });
});

export const OfferedCourseClassScheduleControllers = {
  createOfferedCourseClassSchedule,
  getOfferedCourseClassSchedules,
  getOfferedCourseClassSchedule,
  updateOfferedCourseClassSchedule,
  deleteOfferedCourseClassSchedule,
};
