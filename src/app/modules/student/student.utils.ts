/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnrolledWithCourseNAcademicSem } from './student.interface';

const groupAcademicInfo = (
  enrolledCourses: EnrolledWithCourseNAcademicSem[]
) => {
  /*
    Purpose: Group Academic Info by unique Adademic Semester and its completed courses
    Format: 
    [
      {
        ...academicSemester,
        completedCourses: [
          {
            ...enrolledCourse
          }
        ]
      }  
    ]
  */

  const groupData = enrolledCourses.reduce(
    (result: any, enrolledCourse: EnrolledWithCourseNAcademicSem) => {
      const academicSemester = enrolledCourse.academicSemester;

      const existingGroup = result.find(
        (group: EnrolledWithCourseNAcademicSem) =>
          group.academicSemesterId === academicSemester.id
      );

      if (existingGroup) {
        existingGroup.completedCourses.push({
          id: enrolledCourse.id,
          createdAt: enrolledCourse.createdAt,
          updatedAt: enrolledCourse.updatedAt,
          courseId: enrolledCourse.courseId,
          studentId: enrolledCourse.studentId,
          grade: enrolledCourse.grade,
          point: enrolledCourse.point,
          totalMarks: enrolledCourse.totalMarks,
          course: enrolledCourse.course,
        });
      } else {
        result.push({
          academicSemester,
          completedCourses: [
            {
              id: enrolledCourse.id,
              createdAt: enrolledCourse.createdAt,
              updatedAt: enrolledCourse.updatedAt,
              courseId: enrolledCourse.courseId,
              studentId: enrolledCourse.studentId,
              grade: enrolledCourse.grade,
              point: enrolledCourse.point,
              totalMarks: enrolledCourse.totalMarks,
              course: enrolledCourse.course,
            },
          ],
        });
      }

      return result;
    },
    []
  );

  return groupData;
};

export const StudentUtils = {
  groupAcademicInfo,
};
