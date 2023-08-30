import { z } from 'zod';

const createOfferedCourseSectionZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    maxCapacity: z.number({ required_error: 'Max capacity is required' }),
    currentlyEnrolled: z.number({
      required_error: 'Currently enrolled is required',
    }),
    offeredCourseId: z.string({
      required_error: 'Offer Course Id is required',
    }),
  }),
});

const updateOfferedCourseSectionZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    maxCapacity: z.number().optional(),
    currentlyEnrolled: z.number().optional(),
    offeredCourseId: z.string().optional(),
  }),
});

export const OfferedCourseSectionValidators = {
  createOfferedCourseSectionZodSchema,
  updateOfferedCourseSectionZodSchema,
};
