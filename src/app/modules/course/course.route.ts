import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseControllers } from './course.controller';
import { CourseValidators } from './course.validation';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
const route = express.Router();

route.get('/', CourseControllers.getCourses);
route.get('/:id', CourseControllers.getCourse);

route.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(CourseValidators.createCourseZodSchema),
  CourseControllers.createCourse
);

route.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(CourseValidators.updateCourseZodSchema),
  CourseControllers.updateCourse
);

route.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseControllers.deleteCourse
);

route.post(
  '/:id/assign-faculties',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(CourseValidators.assignOrRemoveFacultiesZodSchema),
  CourseControllers.assignFaculties
);

route.delete(
  '/:id/remove-faculties',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(CourseValidators.assignOrRemoveFacultiesZodSchema),
  CourseControllers.removeFaculties
);

export const CourseRoute = route;
