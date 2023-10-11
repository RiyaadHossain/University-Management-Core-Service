import { OfferedCourse } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { offeredCourseFilters } from './offeredCourse.constant';
import { OfferedCourseServices } from './offeredCourse.services';

const createOfferedCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourse(req.body);
  sendResponse<OfferedCourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course created successfully.',
    data: result,
  });
});

const getOfferedCourses: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, offeredCourseFilters);
  const options = pick(req.query, paginationFields);

  const result = await OfferedCourseServices.getOfferedCourses(filters, options);

  sendResponse<OfferedCourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course fetched successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getOfferedCourse: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await OfferedCourseServices.getOfferedCourse(id);

  sendResponse<OfferedCourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course fetched successfully.',
    data: result,
  });
});

const updateOfferedCourse: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const offeredCourseData = req.body;

  const result = await OfferedCourseServices.updateOfferedCourse(id, offeredCourseData);

  sendResponse<OfferedCourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course updated successfully.',
    data: result,
  });
});

const deleteOfferedCourse: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await OfferedCourseServices.deleteOfferedCourse(id);

  sendResponse<OfferedCourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course deleted successfully.',
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getOfferedCourses,
  getOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
