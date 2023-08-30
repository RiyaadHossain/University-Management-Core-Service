import { OfferedCourseSection } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { offeredCourseSectionFilters } from './offeredCourseSection.constant';
import { OfferedCourseSectionServices } from './offeredCourseSection.services';

const createOfferedCourseSection: RequestHandler = catchAsync(async (req, res) => {
  const result = await OfferedCourseSectionServices.createOfferedCourseSection(req.body);
  sendResponse<OfferedCourseSection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourseSection created successfully.',
    data: result,
  });
});

const getOfferedCourseSections: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, offeredCourseSectionFilters);
  const options = pick(req.query, paginationFields);

  const result = await OfferedCourseSectionServices.getOfferedCourseSections(filters, options);

  sendResponse<OfferedCourseSection[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourseSection fetched successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getOfferedCourseSection: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await OfferedCourseSectionServices.getOfferedCourseSection(id);

  sendResponse<OfferedCourseSection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourseSection fetched successfully.',
    data: result,
  });
});

const updateOfferedCourseSection: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const offeredCourseSectionData = req.body;

  const result = await OfferedCourseSectionServices.updateOfferedCourseSection(id, offeredCourseSectionData);

  sendResponse<OfferedCourseSection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourseSection updated successfully.',
    data: result,
  });
});

const deleteOfferedCourseSection: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await OfferedCourseSectionServices.deleteOfferedCourseSection(id);

  sendResponse<OfferedCourseSection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourseSection deleted successfully.',
    data: result,
  });
});

export const OfferedCourseSectionControllers = {
  createOfferedCourseSection,
  getOfferedCourseSections,
  getOfferedCourseSection,
  updateOfferedCourseSection,
  deleteOfferedCourseSection,
};
