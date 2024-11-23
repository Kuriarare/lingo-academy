import { useCallback, useMemo } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

const useFormattedEvents = (user) => {
  const endDate = dayjs().add(2, "month");  // Only load events for the next 2 months

  // Format events based on schedules
  const formatEvents = useCallback((schedules, nameKey) => {
    return schedules.flatMap((event) => {
      console.log('raw event',event)
      // Generate recurring events for up to two months
      return Array.from({ length: 8 }, (_, i) => {
        const start = dayjs(event.initialDateTime).local().add(i * 7, "day");
        const end = dayjs(event.endTime).local().add(i * 7, "day");
  
        if (start.isBefore(endDate)) {
          return {
            title: event[nameKey],   // Event title: studentName or teacherName based on role
            start: start.toDate(),
            end: end.toDate(),
            studentId: event.studentId,  // For teacher role
            eventId: event.id,  
          };
        }
        return null;
      }).filter(Boolean);  // Remove any nulls (invalid events)
    });
  }, [ endDate]);
  

  // Memoize formatted events based on user role and schedule data
  const formattedEvents = useMemo(() => {
    if (user.role === "teacher" && user.teacherSchedules) {
      return formatEvents(user.teacherSchedules, "studentName");
    } else if (user.role === "user" && user.studentSchedules) {
      return formatEvents(user.studentSchedules, "teacherName");
    }
    return [];  // Return an empty array if no events
  }, [user.role, user.teacherSchedules, user.studentSchedules, formatEvents]);

  return formattedEvents;
};

export default useFormattedEvents;
