export type IFilters = {
  searchTerm?: string;
  title?: string;
  code?: number;
  startMonth?: string;
  endMonth?: string;
};

export type IMyCourseStudentsPayload = {
  academicSemesterId?: string;
  courseId?: string;
  offeredCourseSectionId?: string;
};
