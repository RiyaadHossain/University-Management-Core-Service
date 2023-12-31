import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyControllers } from './faculty.controller';
import { FacultyValidators } from './faculty.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const route = express.Router();

route.get('/', FacultyControllers.getFaculties);

route.get(
  '/my-courses',
  auth(ENUM_USER_ROLE.FACULTY),
  FacultyControllers.myCourses
);

route.get(
  '/my-course-students',
  auth(ENUM_USER_ROLE.FACULTY),
  FacultyControllers.myCourseStudents
);

route.get('/:id', FacultyControllers.getFaculty);

route.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
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

route.post(
  '/:id/assign-courses',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(FacultyValidators.assignOrRemoveCoursesZodSchema),
  FacultyControllers.assignCourses
);

route.delete(
  '/:id/remove-courses',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(FacultyValidators.assignOrRemoveCoursesZodSchema),
  FacultyControllers.removeCourses
);

export const FacultyRoute = route;
