import { Faculty } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { facultyFilters } from './faculty.constant';
import { FacultyServices } from './faculty.services';

const createFaculty: RequestHandler = catchAsync(async (req, res) => {
  const result = await FacultyServices.createFaculty(req.body);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty created successfully.',
    data: result,
  });
});

const getFaculties: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, facultyFilters);
  const options = pick(req.query, paginationFields);

  const result = await FacultyServices.getFaculties(filters, options);

  sendResponse<Faculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Facultys fetched successfully.',
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
    message: 'Faculty fetched successfully.',
    data: result,
  });
});

export const FacultyControllers = {
  createFaculty,
  getFaculties,
  getFaculty,
};
