import { useCallback, useMemo } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

const useFormattedEvents = (user) => {
  const endDate = dayjs().add(1, "month"); 

  const formatEvents = useCallback((schedules, nameKey) => {
    return schedules.flatMap((event) => {

      const initialDate = dayjs(event.initialDateTime).local();
      const originalStart = dayjs(event.startTime).local();
      const originalEnd = dayjs(event.endTime).local();

      const eventDayOfWeek = initialDate.day(); 


      const durationMinutes = originalEnd.diff(originalStart, "minute");

      const now = dayjs().startOf("week").local(); // Always start from the beginning of the current week
      let firstOccurrence = now.startOf("day").day(eventDayOfWeek);
      if (firstOccurrence.isBefore(now)) {
        firstOccurrence = firstOccurrence.add(1, "week"); // Ensure it's in the future
      }

      // Generate weekly events for the next 2 months
      return Array.from({ length: 8 }, (_, i) => {
        const start = firstOccurrence.add(i * 7, "day").set("hour", originalStart.hour()).set("minute", originalStart.minute()).set("second", originalStart.second());
        const end = start.add(durationMinutes, "minute");

        if (start.isBefore(endDate)) {
          return {
            title: event[nameKey], 
            start: start.toDate(),
            end: end.toDate(),
            studentId: event.studentId, 
            eventId: event.id,
          };
        }
        return null;
      }).filter(Boolean); // Remove nulls
    });
  }, [endDate]);

  const formattedEvents = useMemo(() => {
    if (user.role === "teacher" && user.teacherSchedules) {
      return formatEvents(user.teacherSchedules, "studentName");
    } else if (user.role === "user" && user.studentSchedules) {
      return formatEvents(user.studentSchedules, "teacherName");
    }
    return []; // Return an empty array if no events
  }, [user.role, user.teacherSchedules, user.studentSchedules, formatEvents]);

  return formattedEvents;
};

export default useFormattedEvents;
