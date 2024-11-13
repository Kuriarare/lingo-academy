import { useState, useEffect, useCallback, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const useFormattedEvents = (user) => {
  const userTimeZone = dayjs.tz.guess();
  const endDate = dayjs().add(2, "month");  // Only load events for two months

  // Memoize formatEvents to avoid unnecessary recalculations
  const formatEvents = useCallback((schedules, nameKey) => {
    return schedules.flatMap((event) => {
      const startTime = dayjs.tz(
        `${event.date} ${event.startTime}`,
        "YYYY-MM-DD HH:mm",
        "Europe/London"
      ).tz(userTimeZone, true);

      const endTime = dayjs.tz(
        `${event.date} ${event.endTime}`,
        "YYYY-MM-DD HH:mm",
        "Europe/London"
      ).tz(userTimeZone, true);

      return Array.from({ length: 8 }, (_, i) => {
        const start = startTime.add(i * 7, "day");
        const end = endTime.add(i * 7, "day");

        if (start.isBefore(endDate)) {
          return {
            title: event[nameKey],
            start: start.toDate(),
            end: end.toDate(),
            studentId: event.studentId,
          };
        }
        return null;
      }).filter(Boolean);
    });
  }, [userTimeZone]);

  // Memoize formatted events based on user role and schedule data
  const formattedEvents = useMemo(() => {
    if (user.role === "teacher" && user.teacherSchedules) {
      return formatEvents(user.teacherSchedules, "studentName");
    } else if (user.role === "user" && user.studentSchedules) {
      return formatEvents(user.studentSchedules, "teacherName");
    }
    return [];
  }, [user.role, user.teacherSchedules, user.studentSchedules, formatEvents]);

  return formattedEvents;  // Return directly as it's already memoized
};

export default useFormattedEvents;
