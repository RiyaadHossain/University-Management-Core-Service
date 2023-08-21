import express from 'express';
import { AcademicSemesterRoute } from '../../modules/academicSemester/academicSemester.route';
import { AcademicDepartmentRoute } from '../../modules/academicDepartment/academicDepartment.route';
import { AcademicFacultyRoute } from '../../modules/academicFaculty/academicFaculty.route';
import { StudentRoute } from '../../modules/student/student.route';
import { FacultyRoute } from '../../modules/faculty/faculty.route';

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
  }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
