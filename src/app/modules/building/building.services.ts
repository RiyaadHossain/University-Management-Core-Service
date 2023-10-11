import { Building, Prisma } from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { IFilters } from './building.interface';
import { buildingSearchAbleFields } from './building.constant';

const createBuilding = async (buildingData: Building): Promise<Building> => {
  const result = await prisma.building.create({
    data: buildingData,
  });

  return result;
};

const getBuildings = async (
  filters: IFilters,
  options: IPageOptions
): Promise<IGenericResponse<Building[]>> => {
  // Pagination and Sorting
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const orCondition = [];
  const { searchTerm } = filters;

  // Searching
  if (searchTerm) {
    orCondition.push({
      OR: buildingSearchAbleFields.map(field => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  const whereCondition: Prisma.BuildingWhereInput = orCondition.length
    ? { AND: orCondition }
    : {};

  const result = await prisma.building.findMany({
    where: whereCondition,
    orderBy: { [sortBy]: sortOrder },
    skip: skip,
    take: limit,
  });
  const total = await prisma.building.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getBuilding = async (id: string): Promise<Building | null> => {
  const result = await prisma.building.findUnique({
    where: { id },
  });

  return result;
};

const updateBuilding = async (
  id: string,
  data: Partial<Building>
): Promise<Building | null> => {
  const result = await prisma.building.update({
    where: { id },
    data,
  });

  return result;
};

const deleteBuilding = async (id: string): Promise<Building | null> => {
  const result = await prisma.building.delete({
    where: { id },
  });

  return result;
};

export const BuildingServices = {
  createBuilding,
  getBuildings,
  getBuilding,
  updateBuilding,
  deleteBuilding,
};
