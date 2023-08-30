import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseSectionControllers } from './offeredCourseSection.controller';
import { OfferedCourseSectionValidators } from './offeredCourseSection.validation';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
const route = express.Router();

route.get('/', OfferedCourseSectionControllers.getOfferedCourseSections);
route.get('/:id', OfferedCourseSectionControllers.getOfferedCourseSection);

route.post(
  '/',
  validateRequest(
    OfferedCourseSectionValidators.createOfferedCourseSectionZodSchema
  ),
  OfferedCourseSectionControllers.createOfferedCourseSection
);

route.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(
    OfferedCourseSectionValidators.updateOfferedCourseSectionZodSchema
  ),
  OfferedCourseSectionControllers.updateOfferedCourseSection
);

route.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseSectionControllers.deleteOfferedCourseSection
);

export const OfferedCourseSectionRoute = route;
