export type IFilters = {
  searchTerm?: string;
  title?: string;
  code?: number;
  startMonth?: string;
  endMonth?: string;
};

export type ICourseData = {
  id: string;
  title: string;
  code: string;
  credits: number;
  prerequisite: {
    courseId: string;
  }[];
};
