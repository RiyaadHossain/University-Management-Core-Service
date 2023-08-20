import { Faculty } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../constants/pagination';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import { FacultyServices } from './faculty.services';
import { facultyFilters } from './faculty.constant';

const createFaculty: RequestHandler = catchAsync(async (req, res) => {
  const result = await FacultyServices.createFaculty(
    req.body
  );
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester created successfully.',
    data: result,
  });
});

const getFaculties: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, facultyFilters);
  const options = pick(req.query, paginationFields);

  const result = await FacultyServices.getFaculties(
    filters,
    options
  );

  sendResponse<Faculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semesters fetched successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getFaculty: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await FacultyServices.getFaculty(id);

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester fetched successfully.',
    data: result,
  });
});

export const FacultyControllers = {
  createFaculty,
  getFaculties,
  getFaculty,
};
