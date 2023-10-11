export const offeredCourseClassScheduleFilters = ['searchTerm', 'dayOfWeek'];

export const offeredCourseClassScheduleSearchAbleFields = ['dayOfWeek'];

export const offeredCourseClassScheduleRelationalFields = [
  'offeredCourseSectionId',
  'semesterRegistrationId',
  'facultyId',
  'roomId',
];

export const offeredCourseClassScheduleRelationalFieldsMapper: {
  [key: string]: string;
} = {
  offeredCourseSectionId: 'offeredCourseSection',
  facultyId: 'faculty',
  roomId: 'room',
  semesterRegistrationId: 'semesterRegistration',
};

export const offeredCourseClassScheduleFilterAbleFields = [
  'searchTerm',
  'dayOfWeek',
  'offeredCourseSectionId',
  'semesterRegistrationId',
  'roomId',
  'facultyId',
];
