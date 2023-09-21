import { RedisClient } from '../../../shared/redis';
import { EVENT_STUDENT_CREATE } from './student.constant';
import { StudentServices } from './student.services';

export const initStudentEvents = () => {
  RedisClient.subscribe(EVENT_STUDENT_CREATE, async (catched: string) => {
    const data = JSON.parse(catched);
    await StudentServices.createStudentEvent(data.student);
  });
};
