import { WeekDays } from "@prisma/client";

export type IFilters = {
  searchTerm?: string;
  title?: string;
  code?: number;
  startMonth?: string;
  endMonth?: string;
};

export type IClassSchedule = {
  startTime: string;
  endTime: string;
  dayOfWeek: WeekDays;
  roomId: string;
  facultyId: string;
}

export type IOfferedCourseSectionCreate = {
  title: string;
  maxCapacity: number;
  offeredCourseId: string;
  classSchedules: IClassSchedule[]
}