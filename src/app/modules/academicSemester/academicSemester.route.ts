import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterControllers } from './academicSemester.controller';
import { AcademicSemesterValidators } from './academicSemester.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const route = express.Router();

route.get('/', AcademicSemesterControllers.getAcademicSemesters);
route.get('/:id', AcademicSemesterControllers.getAcademicSemester);

route.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(AcademicSemesterValidators.createAcademicSemesterZodSchema),
  AcademicSemesterControllers.createAcademicSemester
);

route.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(AcademicSemesterValidators.updateAcademicSemesterZodSchema),
  AcademicSemesterControllers.updateAcademicSemester
);

route.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AcademicSemesterControllers.deleteAcademicSemester
);

export const AcademicSemesterRoute = route;
