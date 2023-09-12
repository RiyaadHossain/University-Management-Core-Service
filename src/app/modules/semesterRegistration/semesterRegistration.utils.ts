/* eslint-disable @typescript-eslint/no-explicit-any */
const getAvailableCourses = (
  offeredCourses: any,
  studentCompletedCourses: any,
  studentCurrentlyTakanCourses: any
) => {
  const completedCoursesId = studentCompletedCourses.map(
    (course: any) => course.courseId
  );

  const availableCoursesList = offeredCourses
    // 1. Remove - Completed Courses
    .filter(
      (offeredCourse: any) =>
        !completedCoursesId.includes(offeredCourse.courseId)
    )
    // 2. Remove - Not fulfil preRequisite courses
    .filter((offeredCourse: any) => {
      const preRequisites = offeredCourse.course.preRequisite;
      if (preRequisites.length) {
        const preRequisiteIds = preRequisites.map(
          (preRequisite: any) => preRequisite.preRequisiteId
        );
        const isPreRequisiteFulfiled = preRequisiteIds.every((id: string) =>
          completedCoursesId.includes(id)
        );
        return isPreRequisiteFulfiled;
      } else {
        return true;
      }
    })
    // 2. Set Flag - isTaken (If the course is taken)
    .map((offeredCourse: any) => {
      const isAlreadyTakenCourse = studentCurrentlyTakanCourses.find(
        (studentCourse: any) =>
          studentCourse.offeredCourseId === offeredCourse.id
      );

      if (isAlreadyTakenCourse) {
        offeredCourse.offeredCourseSections.map((section: any) => {
          if (section.id === isAlreadyTakenCourse.offeredCourseSectionId) {
            section.isTaken = true;
          } else {
            section.isTaken = false;
          }
        });
        return {
          ...offeredCourse,
          isCourseTaken: true,
        };
      } else {
        offeredCourse.offeredCourseSections.map((section: any) => {
          section.isTaken = false;
        });
        return {
          ...offeredCourse,
          isCourseTaken: false,
        };
      }
    });

  return availableCoursesList;
};

export const SemesterRegistrationUtils = {
  getAvailableCourses,
};
