import { initFacultyEvents } from '../modules/faculty/faculty.event';
import { initStudentEvents } from '../modules/student/student.event';

export const subscribeToEvents = () => {
  initStudentEvents();
  initFacultyEvents()
};
