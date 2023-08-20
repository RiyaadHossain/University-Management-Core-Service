import { AcademicDepartment } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../constants/pagination';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import { academicDepartmentFilters } from './academicDepartment.constant';
import { AcademicDepartmentServices } from './academicDepartment.services';

const createAcademicDepartment: RequestHandler = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentServices.createAcademicDepartment(
    req.body
  );
  sendResponse<AcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department created successfully.',
    data: result,
  });
});

const getAcademicDepartments: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, academicDepartmentFilters);
  const options = pick(req.query, paginationFields);

  const result = await AcademicDepartmentServices.getAcademicDepartments(
    filters,
    options
  );

  sendResponse<AcademicDepartment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Departments fetched successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getAcademicDepartment: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await AcademicDepartmentServices.getAcademicDepartment(id);

  sendResponse<AcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department fetched successfully.',
    data: result,
  });
});

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAcademicDepartments,
  getAcademicDepartment,
};
