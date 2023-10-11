export type IFilters = {
  searchTerm?: string;
  title?: string;
  code?: number;
  startMonth?: string;
  endMonth?: string;
};

export type IOfferedCourse = {
  courseIds: string[];
  academicDepartmentId: string;
  semesterRegistrationId: string;
};
