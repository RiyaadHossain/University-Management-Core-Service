import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingControllers } from './building.controller';
import { BuildingValidators } from './building.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const route = express.Router();

route.get('/', BuildingControllers.getBuildings);
route.get('/:id', BuildingControllers.getBuilding);

route.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(BuildingValidators.createBuildingZodSchema),
  BuildingControllers.createBuilding
);

route.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(BuildingValidators.updateBuildingZodSchema),
  BuildingControllers.updateBuilding
);

route.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BuildingControllers.deleteBuilding
);

export const BuildingRoute = route;
