import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyControllers } from './faculty.controller';
import { FacultyValidators } from './faculty.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const route = express.Router();

route.get('/', FacultyControllers.getFaculties);
route.get('/:id', FacultyControllers.getFaculty);

route.post(
  '/',
  validateRequest(FacultyValidators.createFacultyZodSchema),
  FacultyControllers.createFaculty
);

route.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(FacultyValidators.updateFacultyZodSchema),
  FacultyControllers.updateFaculty
);

route.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyControllers.deleteFaculty
);
export const FacultyRoute = route;
