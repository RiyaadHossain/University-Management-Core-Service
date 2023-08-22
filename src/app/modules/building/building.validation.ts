import { z } from 'zod';

const createBuildingZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
  }),
});

const updateBuildingZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const BuildingValidators = {
  createBuildingZodSchema,
  updateBuildingZodSchema,
};
