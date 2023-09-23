import express from 'express';
import { studentEnrolledCourseMarkControllers } from './studentEnrolledCourseMark.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { StudentEnrolledCourseMarkValidators } from './studentEnrolledCourseMark.validation';
const router = express.Router();

router.get(
  '/',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  studentEnrolledCourseMarkControllers.getAllStudentEnrolledCourseMark
);

router.get(
  '/my-marks',
  auth(ENUM_USER_ROLE.STUDENT),
  studentEnrolledCourseMarkControllers.myMarks
);

router.patch(
  '/update-marks',
  auth(ENUM_USER_ROLE.FACULTY),
  validateRequest(StudentEnrolledCourseMarkValidators.updateStudentMarks),
  studentEnrolledCourseMarkControllers.updateStudentMarks
);

router.patch(
  '/update-final-marks',
  auth(ENUM_USER_ROLE.FACULTY),
  validateRequest(StudentEnrolledCourseMarkValidators.updateStudentCourseFinalMarks),
  studentEnrolledCourseMarkControllers.updateFinalMarks
);

export const StudentEnrolledCourseMarkRoute = router;
