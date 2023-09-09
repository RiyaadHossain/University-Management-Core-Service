import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { studentEnrolledCourseMarkServices } from './studentEnrolledCourseMark.services';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';

const updateStudentMarks: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body
  const result = await studentEnrolledCourseMarkServices.updateStudentMarks(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New Registration started successfully.',
    data: result,
  });
});

export const studentEnrolledCourseMarkControllers = { updateStudentMarks };
