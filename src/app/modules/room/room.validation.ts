import { z } from 'zod';

const createRoomZodSchema = z.object({
  body: z.object({
    roomNumber: z.string({ required_error: 'Room Number is required' }),
    floor: z.string({ required_error: 'Floor is required' }),
  }),
});

const updateRoomZodSchema = z.object({
  body: z.object({
    roomNumber: z.string().optional(),
    floor: z.string().optional(),
  }),
});

export const RoomValidators = {
  createRoomZodSchema,
  updateRoomZodSchema,
};
