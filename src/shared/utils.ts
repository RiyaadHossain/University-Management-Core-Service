import { WeekDays } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const asyncForEach = async (array: any[], callback: any) => {
  if (!Array.isArray(array)) throw new Error('Expected an array');

  for (const element of array) {
    await callback(element);
  }
};

export const hasTimeConfilct =  (
  existingSlots: {
    startTime: string;
    endTime: string;
    dayOfWeek: WeekDays;
  }[],
  newSlot: {
    startTime: string;
    endTime: string;
    dayOfWeek: WeekDays;
  }
): boolean => {
  for (const slot of existingSlots) {
    const existingStart = new Date(`1970-01-01T${slot.startTime}:00`);
    const existingEnd = new Date(`1970-01-01T${slot.endTime}:00`);
    const newStart = new Date(`1970-01-01T${newSlot.startTime}:00`);
    const newEnd = new Date(`1970-01-01T${newSlot.endTime}:00`);

    if (newStart < existingEnd && newEnd > existingStart) {
      return true;
    }
  }

  return false;
};
