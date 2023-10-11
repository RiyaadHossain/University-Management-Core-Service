import { Building } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { BuildingServices } from './building.services';
import { buildingFilters } from './building.constant';

const createBuilding: RequestHandler = catchAsync(async (req, res) => {
  const result = await BuildingServices.createBuilding(req.body);
  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building created successfully.',
    data: result,
  });
});

const getBuildings: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, buildingFilters);
  const options = pick(req.query, paginationFields);

  const result = await BuildingServices.getBuildings(filters, options);

  sendResponse<Building[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Buildings fetched successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getBuilding: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await BuildingServices.getBuilding(id);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building fetched successfully.',
    data: result,
  });
});

const updateBuilding: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const buildingData = req.body;

  const result = await BuildingServices.updateBuilding(id, buildingData);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building updated successfully.',
    data: result,
  });
});

const deleteBuilding: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await BuildingServices.deleteBuilding(id);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building deleted successfully.',
    data: result,
  });
});

export const BuildingControllers = {
  createBuilding,
  getBuildings,
  getBuilding,
  updateBuilding,
  deleteBuilding,
};
