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

const router = express.Router();

const moduleRoutes = [
  {
    path: '/academicSemesters',
    route: AcademicSemesterRoute,
  },
  {
    path: '/academicDepartments',
    route: AcademicDepartmentRoute,
  },
  {
    path: '/academicFaculties',
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
    path: '/semesterRegistrations',
    route: SemesterRegistrationRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
