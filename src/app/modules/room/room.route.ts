import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { RoomControllers } from './room.controller';
import { RoomValidators } from './room.validation';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
const route = express.Router();

route.get('/', RoomControllers.getRooms);
route.get('/:id', RoomControllers.getRoom);

route.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(RoomValidators.createRoomZodSchema),
  RoomControllers.createRoom
);

route.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(
    RoomValidators.updateRoomZodSchema
  ),
  RoomControllers.updateRoom
);

route.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  RoomControllers.deleteRoom
);

export const RoomRoute = route;
