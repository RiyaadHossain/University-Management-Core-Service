import { Course } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { courseFilters } from './course.constant';
import { CourseServices } from './course.services';

const createCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourse(req.body);
  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course created successfully.',
    data: result,
  });
});

const getCourses: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, courseFilters);
  const options = pick(req.query, paginationFields);

  const result = await CourseServices.getCourses(filters, options);

  sendResponse<Course[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course fetched successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getCourse: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await CourseServices.getCourse(id);

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course fetched successfully.',
    data: result,
  });
});

const updateCourse: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const courseData = req.body;

  const result = await CourseServices.updateCourse(id, courseData);

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully.',
    data: result,
  });
});

const deleteCourse: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await CourseServices.deleteCourse(id);

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course deleted successfully.',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
};
