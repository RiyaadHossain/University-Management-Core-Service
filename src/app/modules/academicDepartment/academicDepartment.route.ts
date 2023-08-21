import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import { academicDepartmentValidators } from './academicDepartment.validation';
const route = express.Router();

route.get('/', AcademicDepartmentControllers.getAcademicDepartments);
route.get('/:id', AcademicDepartmentControllers.getAcademicDepartment);

route.post(
  '/',
  validateRequest(
    academicDepartmentValidators.createAcademicDepartmentZodSchema
  ),
  AcademicDepartmentControllers.createAcademicDepartment
);

export const AcademicDepartmentRoute = route;
