import express from 'express';
import { studentEnrolledCourseMarkControllers } from './studentEnrolledCourseMark.controller';
const router = express.Router();

router.patch(
  '/update-marks',
  studentEnrolledCourseMarkControllers.updateStudentMarks
);

export const StudentEnrolledCourseMarkRoute = router;
