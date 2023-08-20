import { z } from 'zod';

const createStudentZodSchema = z.object({
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

export const studentValidators = { createStudentZodSchema };
