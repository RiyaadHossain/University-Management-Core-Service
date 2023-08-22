import { Room, Prisma } from '@prisma/client';
import {
  IPageOptions,
  paginationHelpers,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { IFilters } from './room.interface';
import { roomSearchAbleFields } from './room.constant';

const createRoom = async (roomData: Room): Promise<Room> => {
  const result = await prisma.room.create({
    data: roomData,
  });

  return result;
};

const getRooms = async (
  filters: IFilters,
  options: IPageOptions
): Promise<IGenericResponse<Room[]>> => {
  // Pagination and Sorting
  const { limit, skip, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const orCondition = [];
  const { searchTerm, ...filtersData } = filters;

  // Searching
  if (searchTerm) {
    orCondition.push({
      OR: roomSearchAbleFields.map(field => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  // Filtering
  if (Object.keys(filtersData).length) {
    orCondition.push({
      AND: Object.keys(filtersData).map(field => ({
        [field]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          equals: (filtersData as any)[field],
        },
      })),
    });
  }

  const whereCondition: Prisma.RoomWhereInput = orCondition.length
    ? { AND: orCondition }
    : {};

  const result = await prisma.room.findMany({
    where: whereCondition,
    orderBy: { [sortBy]: sortOrder },
    skip: skip,
    take: limit,
  });
  const total = await prisma.room.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getRoom = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.findUnique({
    where: { id },
  });

  return result;
};

const updateRoom = async (
  id: string,
  data: Partial<Room>
): Promise<Room | null> => {
  const result = await prisma.room.update({
    where: { id },
    data,
  });

  return result;
};

const deleteRoom = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.delete({
    where: { id },
  });

  return result;
};

export const RoomServices = {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
};
