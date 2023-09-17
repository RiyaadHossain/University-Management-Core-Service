export type IStudentSemesterPaymentPayload = {
  studentId: string;
  academicSemesterId: string;
  fullPaymentAmount: number;
};

export type IStudentSemesterPaymentFilterRequest = {
  searchTerm?: string | undefined;
  academicSemesterId?: string | undefined;
  studentId?: string | undefined;
};
