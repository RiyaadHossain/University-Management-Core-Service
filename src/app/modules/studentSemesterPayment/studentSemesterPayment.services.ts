import { Prisma, PrismaClient } from '@prisma/client';
import { IStudentSemesterPaymentPayload } from './studentSemesterPayment.interface';
import { DefaultArgs } from '@prisma/client/runtime/library';

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

export const studentSemesterPaymentServices = {
  createStudentSemesterPayment,
};
