import { AcademicFaculty } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { academicFacultyFilters } from './academicFaculty.constant';
import { AcademicFacultyServices } from './academicFaculty.services';

const createAcademicFaculty: RequestHandler = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.createAcademicFaculty(req.body);
  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty created successfully.',
    data: result,
  });
});

const getAcademicFaculties: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, academicFacultyFilters);
  const options = pick(req.query, paginationFields);

  const result = await AcademicFacultyServices.getAcademicFaculties(
    filters,
    options
  );

  sendResponse<AcademicFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Facultys fetched successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getAcademicFaculty: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await AcademicFacultyServices.getAcademicFaculty(id);

  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty fetched successfully.',
    data: result,
  });
});

const updateAcademicFaculty: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const academicFacultyData = req.body;

  const result = await AcademicFacultyServices.updateAcademicFaculty(
    id,
    academicFacultyData
  );

  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicFaculty updated successfully.',
    data: result,
  });
});

const deleteAcademicFaculty: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await AcademicFacultyServices.deleteAcademicFaculty(id);

  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicFaculty deleted successfully.',
    data: result,
  });
});

export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAcademicFaculties,
  getAcademicFaculty,
  updateAcademicFaculty,
  deleteAcademicFaculty,
};
