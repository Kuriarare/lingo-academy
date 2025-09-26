import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(isSameOrAfter);
dayjs.extend(weekOfYear);

/**
 * Computes the next occurrence for a session based on its initialDateTime.
 * Assumes the event recurs weekly.
 *
 * If the initialDateTime is still in the future, that is returned.
 * Otherwise, we add whole weeks until the event falls in the future.
 */
const getNextOccurrence = (session, now) => {
  const initial = dayjs(session.initialDateTime);
  if (initial.isSameOrAfter(now)) {
    return initial;
  }
  // Calculate how many full weeks to add to reach a future date.
  const diffInWeeks = Math.ceil(now.diff(initial, 'week', true));
  return initial.add(diffInWeeks, 'week');
};

/**
 * Returns exactly 3 upcoming sessions.
 *
 * For teachers (from teacherSchedules):  
 *   – Compute each session’s nextOccurrence and take the first three.
 *
 * For students (from studentSchedules):  
 *   • If only one schedule entry exists, generate three occurrences by adding 0, 1, and 2 weeks.
 *   • If more than one schedule exists:
 *       - First, get the base occurrence (the next upcoming time) for each schedule.
 *       - If that yields 3 or more occurrences, return the earliest three.
 *       - Otherwise (e.g. if there are 2 entries), supplement by computing the next week’s occurrence
 *         for each schedule, then sort and pick the earliest 3 overall.
 */
const getNextClasses = (user) => {
  if (!user || !user.role) return [];
  const now = dayjs();

  if (user.role === "teacher") {
    const schedules = user.teacherSchedules;
    if (!schedules || schedules.length === 0) return [];
    const computedSessions = schedules.map((session) => ({
      ...session,
      nextOccurrence: getNextOccurrence(session, now),
    }));
    const futureSessions = computedSessions
      .filter((session) => session.nextOccurrence.isSameOrAfter(now))
      .sort((a, b) => a.nextOccurrence.diff(b.nextOccurrence));
    return futureSessions.slice(0, 3);
  } else {
    // Student logic
    const schedules = user.studentSchedules;
    if (!schedules || schedules.length === 0) return [];

    if (schedules.length === 1) {
      // Only one schedule entry: generate three consecutive occurrences.
      const session = schedules[0];
      const base = getNextOccurrence(session, now);
      return [0, 1, 2].map((i) => ({ ...session, occurrence: base.add(i, 'week') }));
    } else {
      // Two or more schedule entries.
      // Get the base occurrence for each schedule.
      let baseOccurrences = schedules.map((session) => ({
        ...session,
        occurrence: getNextOccurrence(session, now),
      }));
      baseOccurrences.sort((a, b) => a.occurrence.diff(b.occurrence));

      if (baseOccurrences.length >= 3) {
        // We already have three (or more) distinct events.
        return baseOccurrences.slice(0, 3);
      } else {
        // For example, if there are 2 schedule entries, we need to supplement with next-week occurrences.
        const additional = schedules.map((session) => ({
          ...session,
          occurrence: getNextOccurrence(session, now).add(1, 'week'),
        }));
        const combined = [...baseOccurrences, ...additional];
        combined.sort((a, b) => a.occurrence.diff(b.occurrence));
        return combined.slice(0, 3);
      }
    }
  }
};

export { getNextClasses };
