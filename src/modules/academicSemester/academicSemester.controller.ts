import { RequestHandler } from 'express';
import { AcademicSemester } from '@prisma/client';
import catchAsync from '../../shared/catchAsync';
import { AcademicSemesterServices } from './academicSemester.services';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';

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
  const result = await AcademicSemesterServices.getAcademicSemesters(req.body);
  sendResponse<AcademicSemester[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester fetched successfully.',
    meta: result.meta,
    data: result.data,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAcademicSemesters,
};
