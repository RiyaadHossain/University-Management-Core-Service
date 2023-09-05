import { SemesterRegistration } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { SemesterRegistrationServices } from './semesterRegistration.services';
import { semesterRegistrationFilterableFields } from './semesterRegistration.constant';

const createSemesterRegistration: RequestHandler = catchAsync(
  async (req, res) => {
    const result =
      await SemesterRegistrationServices.createSemesterRegistration(req.body);
    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration created successfully.',
      data: result,
    });
  }
);

const getSemesterRegistrations: RequestHandler = catchAsync(
  async (req, res) => {
    const filters = pick(req.query, semesterRegistrationFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await SemesterRegistrationServices.getSemesterRegistrations(
      filters,
      options
    );

    sendResponse<SemesterRegistration[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registrations fetched successfully.',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSemesterRegistration: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await SemesterRegistrationServices.getSemesterRegistration(id);

  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration fetched successfully.',
    data: result,
  });
});

const updateSemesterRegistration: RequestHandler = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const semesterRegistrationData = req.body;

    const result =
      await SemesterRegistrationServices.updateSemesterRegistration(
        id,
        semesterRegistrationData
      );

    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistration updated successfully.',
      data: result,
    });
  }
);

const deleteSemesterRegistration: RequestHandler = catchAsync(
  async (req, res) => {
    const id = req.params.id;

    const result =
      await SemesterRegistrationServices.deleteSemesterRegistration(id);

    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistration deleted successfully.',
      data: result,
    });
  }
);

const startMyRegistration: RequestHandler = catchAsync(async (req, res) => {
  const studentId = req.user?.id;
  const result = await SemesterRegistrationServices.startMyRegistration(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration started successfully.',
    data: result,
  });
});

const enrollIntoCourse: RequestHandler = catchAsync(async (req, res) => {
  const studentId = req.user?.id;
  const payload = req.body;
  const result = await SemesterRegistrationServices.enrollIntoCourse(
    studentId,
    payload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student enrolled into course successfully.',
    data: result,
  });
});

const withdrawFromCourse: RequestHandler = catchAsync(async (req, res) => {
  const studentId = req.user?.id;
  const payload = req.body;
  const result = await SemesterRegistrationServices.withdrawFromCourse(
    studentId,
    payload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student withdrew from course successfully.',
    data: result,
  });
});

const confirmMyRegistration: RequestHandler = catchAsync(async (req, res) => {
  const studentId = req.user?.id;
  const result = await SemesterRegistrationServices.confirmMyRegistration(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your Registration confirmed successfully.',
    data: result,
  });
});

const getMyRegistration: RequestHandler = catchAsync(async (req, res) => {
  const studentId = req.user?.id;
  const result = await SemesterRegistrationServices.getMyRegistration(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your Registration data fetched successfully.',
    data: result,
  });
});

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getSemesterRegistrations,
  getSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
  startMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration
};
