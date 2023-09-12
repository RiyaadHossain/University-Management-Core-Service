import { Student } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentFilters } from './student.constant';
import { StudentServices } from './student.services';

const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const result = await StudentServices.createStudent(req.body);
  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student created successfully.',
    data: result,
  });
});

const getStudents: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, studentFilters);
  const options = pick(req.query, paginationFields);

  const result = await StudentServices.getStudents(filters, options);

  sendResponse<Student[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students fetched successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getStudent: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await StudentServices.getStudent(id);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student fetched successfully.',
    data: result,
  });
});

const updateStudent: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const studentData = req.body;

  const result = await StudentServices.updateStudent(id, studentData);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updated successfully.',
    data: result,
  });
});

const deleteStudent: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await StudentServices.deleteStudent(id);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted successfully.',
    data: result,
  });
});

const getMyCourses: RequestHandler = catchAsync(async (req, res) => {
  const id = req.user?.id;
  const filter = pick(req.query, ['academicSemesterId', 'courseId']);
  const result = await StudentServices.getMyCourses(id, filter);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student courses data fetched successfully.',
    data: result,
  });
});

const getMyCoursesSchedules: RequestHandler = catchAsync(async (req, res) => {
  const id = req.user?.id;
  const filter = pick(req.query, ['academicSemesterId', 'courseId']);
  const result = await StudentServices.getMyCoursesSchedules(id, filter);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student courses schedules data fetched successfully.',
    data: result,
  });
});

const getMyAcademicInfo: RequestHandler = catchAsync(async (req, res) => {
  const id = req.user?.id;
  const result = await StudentServices.getMyAcademicInfo(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Academic info fetched successfully.',
    data: result,
  });
});

export const StudentControllers = {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getMyCourses,
  getMyCoursesSchedules,
  getMyAcademicInfo
};
