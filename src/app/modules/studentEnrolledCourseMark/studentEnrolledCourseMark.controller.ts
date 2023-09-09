import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { studentEnrolledCourseMarkServices } from './studentEnrolledCourseMark.services';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';

const updateStudentMarks: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await studentEnrolledCourseMarkServices.updateStudentMarks(
    data
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Marks Updated successfully.',
    data: result,
  });
});

const updateFinalMarks: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await studentEnrolledCourseMarkServices.updateFinalMarks(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Final Updated successfully.',
    data: result,
  });
});

export const studentEnrolledCourseMarkControllers = {
  updateStudentMarks,
  updateFinalMarks,
};
