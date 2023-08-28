import { SemesterRegistrationStatus } from '@prisma/client';
import { z } from 'zod';

const createSemesterRegistrationZodSchema = z.object({
  body: z.object({
    startDate: z.coerce.date({ required_error: 'Start date is required!' }),
    endDate: z.coerce.date({ required_error: 'End date is required!' }),
    minCredit: z.number({ required_error: 'Min credit is required!' }),
    maxCredit: z.number({ required_error: 'Max credit is required!' }),
    academicSemesterId: z.string({ required_error: 'Academic Semester is required!' }),
  }),
});

const updateSemesterRegistrationZodSchema = z.object({
  body: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    status: z.enum([...Object.values(SemesterRegistrationStatus)] as [string, ...string[]]).optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
    academicSemesterId: z.string().optional(),
  }),
});

export const SemesterRegistrationValidators = {
  createSemesterRegistrationZodSchema,
  updateSemesterRegistrationZodSchema,
};
