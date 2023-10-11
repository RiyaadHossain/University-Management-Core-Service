import { z } from 'zod';

const createFacultyZodSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: 'First Name is Required' }),
    middleName: z.string({ required_error: 'Middle Name is Required' }),
    lastName: z.string({ required_error: 'Last Name is Required' }),
    profileImage: z.string({ required_error: 'Profile Image is Required' }),
    email: z.string({ required_error: 'Email is Required' }),
    contactNo: z.string({ required_error: 'Contact number is Required' }),
    gender: z.string({ required_error: 'Gender is Required' }),
    bloodgroup: z.string({ required_error: 'Blood group is Required' }),
  }),
});

const updateFacultyZodSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    profileImage: z.string().optional(),
    email: z.string().optional(),
    contactNo: z.string().optional(),
    gender: z.string().optional(),
    bloodgroup: z.string().optional(),
  }),
});

const assignOrRemoveCoursesZodSchema = z.object({
  body: z.object({
    courses: z
      .string({ required_error: "Courses' ids are required" })
      .array(),
  }),
});

export const FacultyValidators = {
  createFacultyZodSchema,
  updateFacultyZodSchema,
  assignOrRemoveCoursesZodSchema,
};
