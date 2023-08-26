import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import { SemesterRegistrationValidators } from './semesterRegistration.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const route = express.Router();

route.get('/', SemesterRegistrationControllers.getSemesterRegistrations);
route.get('/:id', SemesterRegistrationControllers.getSemesterRegistration);

route.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(SemesterRegistrationValidators.createSemesterRegistrationZodSchema),
  SemesterRegistrationControllers.createSemesterRegistration
);

route.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(
    SemesterRegistrationValidators.updateSemesterRegistrationZodSchema
  ),
  SemesterRegistrationControllers.updateSemesterRegistration
);

route.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationControllers.deleteSemesterRegistration
);
export const SemesterRegistrationRoute = route;
