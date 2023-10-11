import {
  AcademicSemester,
  Course,
  StudentEnrolledCourse,
} from '@prisma/client';

export type IFilters = {
  searchTerm?: string;
  title?: string;
  code?: number;
  startMonth?: string;
  endMonth?: string;
};

export type EnrolledWithCourseNAcademicSem =
  | (StudentEnrolledCourse & {
      course: Course;
      academicSemester: AcademicSemester;
    });
