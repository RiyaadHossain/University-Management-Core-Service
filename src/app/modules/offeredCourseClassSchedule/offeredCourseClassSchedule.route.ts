import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseClassScheduleControllers } from './offeredCourseClassSchedule.controller';
import { OfferedCourseClassScheduleValidators } from './offeredCourseClassSchedule.validation';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
const route = express.Router();

route.get(
  '/',
  OfferedCourseClassScheduleControllers.getOfferedCourseClassSchedules
);
route.get(
  '/:id',
  OfferedCourseClassScheduleControllers.getOfferedCourseClassSchedule
);

route.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(
    OfferedCourseClassScheduleValidators.createOfferedCourseClassScheduleZodSchema
  ),
  OfferedCourseClassScheduleControllers.createOfferedCourseClassSchedule
);

route.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(
    OfferedCourseClassScheduleValidators.updateOfferedCourseClassScheduleZodSchema
  ),
  OfferedCourseClassScheduleControllers.updateOfferedCourseClassSchedule
);

route.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseClassScheduleControllers.deleteOfferedCourseClassSchedule
);

export const OfferedCourseClassScheduleRoute = route;
