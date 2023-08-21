import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { StudentValidators } from './student.validation';
import auth from '../../app/middlewares/auth';
import { ENUM_USER_ROLE } from '../../enums/user';
const route = express.Router();

route.get('/', StudentControllers.getStudents);
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
