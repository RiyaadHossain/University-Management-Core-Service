import { z } from 'zod';

const createAcademicDepartmentZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' })
  }),
});

export const academicDepartmentValidators = { createAcademicDepartmentZodSchema };
