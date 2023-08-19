import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { academicSemesterValidators } from './academicSemester.validation';
const route = express.Router();

route.post(
  '/',
  validateRequest(academicSemesterValidators.createAcademicSemesterZodSchema),
  AcademicSemesterControllers.createAcademicSemester
);

export const AcademicSemesterRoute = route;
