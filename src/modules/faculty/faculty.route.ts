import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { facultyValidators } from './faculty.validation';
const route = express.Router();

route.get('/', FacultyControllers.getFaculties);
route.get('/:id', FacultyControllers.getFaculty);

route.post(
  '/',
  validateRequest(facultyValidators.createFacultyZodSchema),
  FacultyControllers.createFaculty
);

export const FacultyRoute = route;
