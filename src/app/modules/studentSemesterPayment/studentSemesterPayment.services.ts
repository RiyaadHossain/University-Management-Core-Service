import { Prisma, PrismaClient, StudentSemesterPayment } from '@prisma/client';
import { IStudentSemesterPaymentPayload } from './studentSemesterPayment.interface';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import {
  studentSemesterPaymentRelationalFields,
  studentSemesterPaymentRelationalFieldsMapper,
  studentSemesterPaymentSearchableFields,
} from './studentSemesterPayment.constant';
import { IStudentSemesterPaymentFilterRequest } from './studentSemesterPayment.interface';
import prisma from '../../../shared/prisma';

const createStudentSemesterPayment = async (
  transactionClient: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: IStudentSemesterPaymentPayload
) => {
  const partialPaymentAmount = payload.fullPaymentAmount * 0.5;
  const totalDueAmount = payload.fullPaymentAmount;

  const data = {
    studentId: payload.studentId,
    academicSemesterId: payload.academicSemesterId,
    fullPaymentAmount: payload.fullPaymentAmount,
    partialPaymentAmount,
    totalDueAmount,
  };

  const isExist = await transactionClient.studentSemesterPayment.findFirst({
    where: {
      student: {
        id: payload.studentId,
      },
      academicSemester: {
        id: payload.academicSemesterId,
      },
    },
  });

  if (!isExist) {
    await transactionClient.studentSemesterPayment.create({
      data,
    });
  }
};

const getAllFromDB = async (
  filters: IStudentSemesterPaymentFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<StudentSemesterPayment[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: studentSemesterPaymentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (studentSemesterPaymentRelationalFields.includes(key)) {
          return {
            [studentSemesterPaymentRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.StudentSemesterPaymentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.studentSemesterPayment.findMany({
    include: {
      academicSemester: true,
      student: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.studentSemesterPayment.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const studentSemesterPaymentServices = {
  createStudentSemesterPayment,
  getAllFromDB,
};
