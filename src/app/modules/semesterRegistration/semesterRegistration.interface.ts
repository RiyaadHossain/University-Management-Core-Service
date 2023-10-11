export type IFilters = {
  searchTerm?: string;
  title?: string;
  code?: number;
  startMonth?: string;
  endMonth?: string;
};

export type IStudentEnrollPayload = {
  offeredCourseId: string;
  offeredCourseSectionId: string;
};
