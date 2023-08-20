import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { studentValidators } from './student.validation';
const route = express.Router();

route.get('/', StudentControllers.getStudents);
route.get('/:id', StudentControllers.getStudent);

route.post(
  '/',
  validateRequest(studentValidators.createStudentZodSchema),
  StudentControllers.createStudent
);

export const StudentRoute = route;
