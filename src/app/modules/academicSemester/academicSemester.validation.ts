import { z } from 'zod';

const createAcademicSemesterZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    year: z.number({ required_error: 'Year is required' }),
    code: z.string({ required_error: 'Code is required' }),
    startMonth: z.string({ required_error: 'Start Month is required' }),
    endMonth: z.string({ required_error: 'End month is required' }),
  }),
});

const updateAcademicSemesterZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    year: z.number().optional(),
    code: z.string().optional(),
    startMonth: z.string().optional(),
    endMonth: z.string().optional(),
  }),
});

export const AcademicSemesterValidators = {
  createAcademicSemesterZodSchema,
  updateAcademicSemesterZodSchema,
};
