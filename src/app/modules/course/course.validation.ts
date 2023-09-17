import { z } from 'zod';

const createCourseZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    code: z.string({ required_error: 'Code is required' }),
    credits: z.number({ required_error: 'Credits is required' }),
  }),
});

const updateCourseZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    code: z.string().optional(),
    credits: z.number().optional(),
  }),
});

const assignOrRemoveFacultiesZodSchema = z.object({
  body: z.object({
    faculties: z.string({required_error: "Faculties' ids are required"}).array(),
  }),
});

export const CourseValidators = {
  createCourseZodSchema,
  updateCourseZodSchema,
  assignOrRemoveFacultiesZodSchema,
};
