import { Student } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../constants/pagination';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import { StudentServices } from './student.services';
import { studentFilters } from './student.constant';

const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const result = await StudentServices.createStudent(req.body);
  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester created successfully.',
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
    message: 'Academic Semesters fetched successfully.',
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
    message: 'Academic Semester fetched successfully.',
    data: result,
  });
});

export const StudentControllers = {
  createStudent,
  getStudents,
  getStudent,
};
