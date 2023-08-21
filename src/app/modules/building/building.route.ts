import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingControllers } from './building.controller';
import { buildingValidators } from './building.validation';
const route = express.Router();

route.get('/', BuildingControllers.getBuildings);
route.get('/:id', BuildingControllers.getBuilding);

route.post(
  '/',
  validateRequest(buildingValidators.createBuildingZodSchema),
  BuildingControllers.createBuilding
);

export const BuildingRoute = route;
