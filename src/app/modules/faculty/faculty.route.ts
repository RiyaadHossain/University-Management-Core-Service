import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyControllers } from './faculty.controller';
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
