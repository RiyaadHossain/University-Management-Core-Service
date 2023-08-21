import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterControllers } from './academicSemester.controller';
import { academicSemesterValidators } from './academicSemester.validation';
const route = express.Router();

route.get('/', AcademicSemesterControllers.getAcademicSemesters);
route.get('/:id', AcademicSemesterControllers.getAcademicSemester);

route.post(
  '/',
  validateRequest(academicSemesterValidators.createAcademicSemesterZodSchema),
  AcademicSemesterControllers.createAcademicSemester
);

export const AcademicSemesterRoute = route;
