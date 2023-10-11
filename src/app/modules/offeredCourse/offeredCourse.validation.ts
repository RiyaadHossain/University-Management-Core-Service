import { z } from 'zod';

const createOfferedCourseZodSchema = z.object({
  body: z.object({
    courseIds: z.array(z.string({ required_error: 'Course Id is required' }), {
      required_error: 'Course Ids is required',
    }),
    academicDepartmentId: z.string({
      required_error: 'Academic Department Id is required',
    }),
    semesterRegistrationId: z.string({
      required_error: 'Semester Registration Id is required',
    }),
  }),
});

const updateOfferedCourseZodSchema = z.object({
  body: z.object({
    courseId: z.string().optional(),
    academicDepartmentId: z.string().optional(),
    semesterRegistrationId: z.string().optional(),
  }),
});

export const OfferedCourseValidators = {
  createOfferedCourseZodSchema,
  updateOfferedCourseZodSchema,
};
