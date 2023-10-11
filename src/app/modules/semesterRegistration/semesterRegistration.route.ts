import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import { SemesterRegistrationValidators } from './semesterRegistration.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const route = express.Router();

route.get('/', SemesterRegistrationControllers.getSemesterRegistrations);
route.get('/get-my-registration', SemesterRegistrationControllers.getMyRegistration);
route.get('/get-my-semsester-courses', SemesterRegistrationControllers.getMySemesterRegCourses);
route.get('/:id', SemesterRegistrationControllers.getSemesterRegistration);

route.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(
    SemesterRegistrationValidators.createSemesterRegistrationZodSchema
  ),
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

route.post(
  '/start-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  validateRequest(SemesterRegistrationValidators.startMyRegistrationZodSchema),
  SemesterRegistrationControllers.startMyRegistration
);

route.post(
  '/enroll-into-course',
  auth(ENUM_USER_ROLE.STUDENT),
  validateRequest(SemesterRegistrationValidators.enrollAndWithdrawZodSchema),
  SemesterRegistrationControllers.enrollIntoCourse
);

route.post(
  '/withdraw-from-course',
  auth(ENUM_USER_ROLE.STUDENT),
  validateRequest(SemesterRegistrationValidators.enrollAndWithdrawZodSchema),
  SemesterRegistrationControllers.withdrawFromCourse
);

route.post(
  '/confirm-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationControllers.confirmMyRegistration
);

route.post(
  '/:semesterRegId/start-new-registration',
  auth(ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationControllers.startNewRegistration
);

export const SemesterRegistrationRoute = route;
