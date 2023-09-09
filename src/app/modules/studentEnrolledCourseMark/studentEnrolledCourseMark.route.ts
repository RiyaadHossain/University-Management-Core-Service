import express from 'express';
import { studentEnrolledCourseMarkControllers } from './studentEnrolledCourseMark.controller';
const router = express.Router();

router.patch(
  '/update-marks',
  studentEnrolledCourseMarkControllers.updateStudentMarks
);

router.patch(
  '/update-final-marks',
  studentEnrolledCourseMarkControllers.updateFinalMarks
);

export const StudentEnrolledCourseMarkRoute = router;
