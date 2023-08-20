import { RequestHandler } from 'express';
import { AcademicSemester } from '@prisma/client';
import catchAsync from '../../shared/catchAsync';
import { AcademicSemesterServices } from './academicSemester.services';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../shared/pick';
import { paginationFields } from '../../constants/pagination';
import { academicSemesterFilters } from './academicSemester.constant';

const createAcademicSemester: RequestHandler = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemester(
    req.body
  );
  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester created successfully.',
    data: result,
  });
});

const getAcademicSemesters: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, academicSemesterFilters);
  const options = pick(req.query, paginationFields);
  
  const result = await AcademicSemesterServices.getAcademicSemesters(
    filters,
    options
  );

  sendResponse<AcademicSemester[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semesters fetched successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getAcademicSemester: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id

  const result = await AcademicSemesterServices.getAcademicSemester(id);

  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester fetched successfully.',
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAcademicSemesters,
  getAcademicSemester,
};
