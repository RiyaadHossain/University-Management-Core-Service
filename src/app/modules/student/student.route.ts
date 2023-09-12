import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StudentControllers } from './student.controller';
import { StudentValidators } from './student.validation';
const route = express.Router();

route.get('/', StudentControllers.getStudents);

route.get(
  '/get-my-courses-schedules',
  auth(ENUM_USER_ROLE.STUDENT),
  StudentControllers.getMyCoursesSchedules
);

route.get(
  '/get-my-courses',
  auth(ENUM_USER_ROLE.STUDENT),
  StudentControllers.getMyCourses
);

route.get('/:id', StudentControllers.getStudent);

route.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(StudentValidators.createStudentZodSchema),
  StudentControllers.createStudent
);

route.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(StudentValidators.updateStudentZodSchema),
  StudentControllers.updateStudent
);

route.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StudentControllers.deleteStudent
);

export const StudentRoute = route;
