import { useState, useEffect, useCallback, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

const useFormattedEvents = (user) => {
  const userTimeZone = dayjs.tz.guess();  // Get user's local time zone
  const endDate = dayjs().add(2, "month");  // Only load events for the next 2 months

  // Format events based on schedules
  const formatEvents = useCallback((schedules, nameKey) => {
    return schedules.flatMap((event) => {
  
      // Log the event initialDateTime as it is (without UTC conversion)
      console.log("Event Initial Date and Time (Raw):", event.initialDateTime);
  
      // Convert and log the event time in the local time zone (system's local timezone)
      const eventLocalTime = dayjs(event.initialDateTime).local().format();  // .local() converts to local time zone
      console.log("Event in Local Time Zone:", eventLocalTime);
  
      // Optionally, if you want to show the event in a specific format
      const formattedEvent = dayjs(event.initialDateTime).local().format('YYYY-MM-DD HH:mm:ss');
      console.log("Formatted Event in Local Time Zone:", formattedEvent);
      
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
          };
        }
        return null;
      }).filter(Boolean);  // Remove any nulls (invalid events)
    });
  }, [userTimeZone, endDate]);
  

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
