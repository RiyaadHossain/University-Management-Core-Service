import express from 'express';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { academicDepartmentValidators } from './academicDepartment.validation';
const route = express.Router();

route.get('/', AcademicDepartmentControllers.getAcademicDepartments);
route.get('/:id', AcademicDepartmentControllers.getAcademicDepartment);

route.post(
  '/',
  validateRequest(academicDepartmentValidators.createAcademicDepartmentZodSchema),
  AcademicDepartmentControllers.createAcademicDepartment
);

export const AcademicDepartmentRoute = route;
