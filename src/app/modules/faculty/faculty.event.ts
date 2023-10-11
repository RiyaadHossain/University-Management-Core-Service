import { RedisClient } from '../../../shared/redis';
import {
  EVENT_FACULTY_CREATE,
  EVENT_FACULTY_DELETE,
  EVENT_FACULTY_UPDATE,
} from './faculty.constant';
import { FacultyServices } from './faculty.services';

export const initFacultyEvents = () => {
  // Create Event
  RedisClient.subscribe(EVENT_FACULTY_CREATE, async (catched: string) => {
    const data = JSON.parse(catched);
    await FacultyServices.createFacultyEvent(data.faculty);
  });

  // Update Event
  RedisClient.subscribe(EVENT_FACULTY_UPDATE, async (catched: string) => {
    const data = JSON.parse(catched);
    await FacultyServices.updateFacultyEvent(data);
  });

  // Delete Event
  RedisClient.subscribe(EVENT_FACULTY_DELETE, async (catched: string) => {
    const data = JSON.parse(catched);
    await FacultyServices.deleteFacultyEvent(data);
  });
};
