import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { RoomControllers } from './room.controller';
import { roomValidators } from './room.validation';
const route = express.Router();

route.get('/', RoomControllers.getRooms);
route.get('/:id', RoomControllers.getRoom);

route.post(
  '/',
  validateRequest(roomValidators.createRoomZodSchema),
  RoomControllers.createRoom
);

export const RoomRoute = route;
