import { z } from 'zod';

const createAcademicDepartmentZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
  }),
});

const updateAcademicDepartmentZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
});

export const AcademicDepartmentValidators = {
  createAcademicDepartmentZodSchema,
  updateAcademicDepartmentZodSchema,
};
