import express from 'express';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { academicFacultyValidators } from './academicFaculty.validation';
const route = express.Router();

route.get('/', AcademicFacultyControllers.getAcademicFacultys);
route.get('/:id', AcademicFacultyControllers.getAcademicFaculty);

route.post(
  '/',
  validateRequest(academicFacultyValidators.createAcademicFacultyZodSchema),
  AcademicFacultyControllers.createAcademicFaculty
);

export const AcademicFacultyRoute = route;
