import { AcademicSemester } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { academicSemesterFilters } from './academicSemester.constant';
import { AcademicSemesterServices } from './academicSemester.services';

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
  const id = req.params.id;

  const result = await AcademicSemesterServices.getAcademicSemester(id);

  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester fetched successfully.',
    data: result,
  });
});

const updateAcademicSemester: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const academicSemesterData = req.body;

  const result = await AcademicSemesterServices.updateAcademicSemester(
    id,
    academicSemesterData
  );

  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicSemester updated successfully.',
    data: result,
  });
});

const deleteAcademicSemester: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await AcademicSemesterServices.deleteAcademicSemester(id);

  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicSemester deleted successfully.',
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAcademicSemesters,
  getAcademicSemester,
  updateAcademicSemester,
  deleteAcademicSemester,
};
