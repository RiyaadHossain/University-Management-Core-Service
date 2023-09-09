import express from 'express';
import { AcademicDepartmentRoute } from '../modules/academicDepartment/academicDepartment.route';
import { AcademicFacultyRoute } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicSemesterRoute } from '../modules/academicSemester/academicSemester.route';
import { FacultyRoute } from '../modules/faculty/faculty.route';
import { StudentRoute } from '../modules/student/student.route';
import { BuildingRoute } from '../modules/building/building.route';
import { RoomRoute } from '../modules/room/room.route';
import { CourseRoute } from '../modules/course/course.route';
import { SemesterRegistrationRoute } from '../modules/semesterRegistration/semesterRegistration.route';
import { OfferedCourseRoute } from '../modules/offeredCourse/offeredCourse.route';
import { OfferedCourseSectionRoute } from '../modules/offeredCourseSection/offeredCourseSection.route';
import { StudentEnrolledCourseMarkRoute } from '../modules/studentEnrolledCourseMark/studentEnrolledCourseMark.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoute,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoute,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoute,
  },
  {
    path: '/students',
    route: StudentRoute,
  },
  {
    path: '/faculties',
    route: FacultyRoute,
  },
  {
    path: '/buildings',
    route: BuildingRoute,
  },
  {
    path: '/rooms',
    route: RoomRoute,
  },
  {
    path: '/courses',
    route: CourseRoute,
  },
  {
    path: '/semester-registrations',
    route: SemesterRegistrationRoute,
  },
  {
    path: '/offered-courses',
    route: OfferedCourseRoute,
  },
  {
    path: '/offered-course-sections',
    route: OfferedCourseSectionRoute,
  },
  {
    path: '/student-enrolled-course-mark',
    route: StudentEnrolledCourseMarkRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
