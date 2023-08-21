import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import { academicFacultyValidators } from './academicFaculty.validation';
const route = express.Router();

route.get('/', AcademicFacultyControllers.getAcademicFaculties);
route.get('/:id', AcademicFacultyControllers.getAcademicFaculty);

route.post(
  '/',
  validateRequest(academicFacultyValidators.createAcademicFacultyZodSchema),
  AcademicFacultyControllers.createAcademicFaculty
);

export const AcademicFacultyRoute = route;
