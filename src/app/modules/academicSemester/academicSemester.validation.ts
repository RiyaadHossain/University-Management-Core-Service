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

export const academicSemesterValidators = { createAcademicSemesterZodSchema };
