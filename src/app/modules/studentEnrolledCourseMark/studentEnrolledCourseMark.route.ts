import express from 'express';
import { studentEnrolledCourseMarkControllers } from './studentEnrolledCourseMark.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router.get(
  '/my-marks',
  auth(ENUM_USER_ROLE.STUDENT),
  studentEnrolledCourseMarkControllers.myMarks
);

router.patch(
  '/update-marks',
  auth(ENUM_USER_ROLE.FACULTY),
  // Zod Validation
  studentEnrolledCourseMarkControllers.updateStudentMarks
);

router.patch(
  '/update-final-marks',
  auth(ENUM_USER_ROLE.FACULTY),
  // Zod Validation
  studentEnrolledCourseMarkControllers.updateFinalMarks
);

export const StudentEnrolledCourseMarkRoute = router;
