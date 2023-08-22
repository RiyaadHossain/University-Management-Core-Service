import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import { AcademicDepartmentValidators } from './academicDepartment.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const route = express.Router();

route.get('/', AcademicDepartmentControllers.getAcademicDepartments);
route.get('/:id', AcademicDepartmentControllers.getAcademicDepartment);

route.post(
  '/',
  validateRequest(
    AcademicDepartmentValidators.createAcademicDepartmentZodSchema
  ),
  AcademicDepartmentControllers.createAcademicDepartment
);

route.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(AcademicDepartmentValidators.updateAcademicDepartmentZodSchema),
  AcademicDepartmentControllers.updateAcademicDepartment
);

route.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AcademicDepartmentControllers.deleteAcademicDepartment
);

export const AcademicDepartmentRoute = route;
