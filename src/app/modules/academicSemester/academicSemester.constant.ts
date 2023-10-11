export const academicSemesterFilters = [
  'searchTerm',
  'title',
  'code',
  'startMonth',
  'endMonth'
];

export const academicSemestersSearchAbleFields = [
  'title',
  'code',
  'startMonth',
  'endMonth',
];

export const academicSemestersFilterAbleFields = [
  'title',
  'code',
  'startMonth',
  'endMonth',
];

export const academicSemesterTitleCodeMap: { [key: string]: string } = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};

export const EVENT_ACADEMIC_SEMESTER_CREATE = 'academic-semester.create';
export const EVENT_ACADEMIC_SEMESTER_UPDATE = 'academic-semester.update';
export const EVENT_ACADEMIC_SEMESTER_DELETE = 'academic-semester.delete';
