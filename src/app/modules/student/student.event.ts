import { RedisClient } from '../../../shared/redis';
import { EVENT_STUDENT_CREATE, EVENT_STUDENT_DELETE, EVENT_STUDENT_UPDATE } from './student.constant';
import { StudentServices } from './student.services';

export const initStudentEvents = () => {
  RedisClient.subscribe(EVENT_STUDENT_CREATE, async (catched: string) => {
    const data = JSON.parse(catched);
    await StudentServices.createStudentEvent(data.student);
  });

  RedisClient.subscribe(EVENT_STUDENT_UPDATE, async (catched: string) => {
    const data = JSON.parse(catched);
    await StudentServices.updateStudentEvent(data);
  });

  RedisClient.subscribe(EVENT_STUDENT_DELETE, async (catched: string) => {
    const data = JSON.parse(catched);
    await StudentServices.deleteStudentEvent(data);
  });
};
