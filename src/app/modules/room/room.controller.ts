import { Room } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { RoomServices } from './room.services';
import { roomFilters } from './room.constant';

const createRoom: RequestHandler = catchAsync(async (req, res) => {
  const result = await RoomServices.createRoom(req.body);
  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room created successfully.',
    data: result,
  });
});

const getRooms: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, roomFilters);
  const options = pick(req.query, paginationFields);

  const result = await RoomServices.getRooms(filters, options);

  sendResponse<Room[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room fetched successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getRoom: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await RoomServices.getRoom(id);

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room fetched successfully.',
    data: result,
  });
});

const updateRoom: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const roomData = req.body;

  const result = await RoomServices.updateRoom(id, roomData);

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room updated successfully.',
    data: result,
  });
});

const deleteRoom: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await RoomServices.deleteRoom(id);

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room deleted successfully.',
    data: result,
  });
});

export const RoomControllers = {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
};
