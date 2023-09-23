import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseControllers } from './offeredCourse.controller';
import { OfferedCourseValidators } from './offeredCourse.validation';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
const route = express.Router();

route.get('/', OfferedCourseControllers.getOfferedCourses);
route.get('/:id', OfferedCourseControllers.getOfferedCourse);

route.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(OfferedCourseValidators.createOfferedCourseZodSchema),
  OfferedCourseControllers.createOfferedCourse
);

route.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(OfferedCourseValidators.updateOfferedCourseZodSchema),
  OfferedCourseControllers.updateOfferedCourse
);

route.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseControllers.deleteOfferedCourse
);

export const OfferedCourseRoute = route;
