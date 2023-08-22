import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import { AcademicFacultyValidators } from './academicFaculty.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const route = express.Router();

route.get('/', AcademicFacultyControllers.getAcademicFaculties);
route.get('/:id', AcademicFacultyControllers.getAcademicFaculty);

route.post(
  '/',
  validateRequest(AcademicFacultyValidators.createAcademicFacultyZodSchema),
  AcademicFacultyControllers.createAcademicFaculty
);

route.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(
    AcademicFacultyValidators.updateAcademicFacultyZodSchema
  ),
  AcademicFacultyControllers.updateAcademicFaculty
);

route.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AcademicFacultyControllers.deleteAcademicFaculty
);
export const AcademicFacultyRoute = route;
