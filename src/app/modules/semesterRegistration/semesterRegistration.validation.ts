import { SemesterRegistrationStatus } from '@prisma/client';
import { z } from 'zod';

const createSemesterRegistrationZodSchema = z.object({
  body: z.object({
    startDate: z.date({ required_error: 'Start date is required!' }),
    endDate: z.date({ required_error: 'End date is required!' }),
    status: z.nativeEnum(SemesterRegistrationStatus),
    minCredit: z.number({ required_error: 'Min credit is required!' }),
    maxCredit: z.number({ required_error: 'Max credit is required!' }),
  }),
});

const updateSemesterRegistrationZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
});

export const SemesterRegistrationValidators = {
  createSemesterRegistrationZodSchema,
  updateSemesterRegistrationZodSchema,
};
