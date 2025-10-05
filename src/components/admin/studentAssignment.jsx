import { useState } from "react";
import Swal from "sweetalert2";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import avatar from "../../assets/logos/avatar.jpg";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// eslint-disable-next-line react/prop-types
const StudentAssignment = ({ teachers, students }) => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [events, setEvents] = useState([]);

  const [eventDetails, setEventDetails] = useState({ start: "", end: "" });
  const [teachersEvents, setTeachersEvents] = useState({});

  const localizer = dayjsLocalizer(dayjs);
  const userTimeZone = dayjs.tz.guess();

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  const studentsWithoutTeacher = students.filter(
    (student) => student.teacher === null
  );

  const handleCalendarOpen = () => {
    if (selectedTeacher?.teacherSchedules) {
      const endDate = dayjs().add(1, "month");

      const formattedEvents = selectedTeacher.teacherSchedules.flatMap(
        (event) => {
          const startTime = dayjs(event.startTime);
          const endTime = dayjs(event.endTime);

          return Array.from({ length: 4 }, (_, i) => {
            const start = startTime.add(i * 7, "day");
            const end = endTime.add(i * 7, "day");
            if (start.isBefore(endDate)) {
              return {
                title:
                  selectedTeacher.role === "teacher"
                    ? event.studentName
                    : event.teacherName,
                start: start.toDate(),
                end: end.toDate(),
                studentId: event.studentId,
              };
            }
            return null;
          }).filter(Boolean);
        }
      );
      setTeachersEvents(formattedEvents);
    }
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleSelectSlot = ({ start }) => {
    // Convert the selected date to UTC before setting it
    // const utcSelectedDate = dayjs(start).utc().toDate();
    setSelectedDate(start); // Store in UTC
    setEventModalOpen(true);
  };

  const handleEventModalClose = () => {
    setEventModalOpen(false);
  };

  const handleEventDetailsChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = () => {
    if (selectedDate && eventDetails.start && eventDetails.end) {
      const timePattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/; // HH:MM format, 24-hour validation

      if (
        !timePattern.test(eventDetails.start) ||
        !timePattern.test(eventDetails.end)
      ) {
        Swal.fire({
          title: "Invalid Time Format",
          text: "Please enter time in HH:MM format (24-hour).",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        return;
      }

      const [startHours, startMinutes] = eventDetails.start
        .split(":")
        .map(Number);
      const [endHours, endMinutes] = eventDetails.end.split(":").map(Number);

      const startDateTime = dayjs(selectedDate)
        .hour(startHours)
        .minute(startMinutes)
        .second(0)
        .millisecond(0)
        .utc() 
        .toDate();

      const endDateTime = dayjs(selectedDate)
        .hour(endHours)
        .minute(endMinutes)
        .second(0)
        .millisecond(0)
        .utc() 
        .toDate();

      const dayOfWeek = dayjs(selectedDate).format("dddd");
      const date = dayjs(selectedDate).format("YYYY-MM-DD");

      // Add the new event to the events array
      setEvents((prev) => [
        ...prev,
        {
          dayOfWeek,
          startTime: eventDetails.start,
          endTime: eventDetails.end,
          date,
          start: startDateTime,
          end: endDateTime,
          teacherName: `${selectedTeacher.name} ${selectedTeacher.lastName}`,
          studentName: `${selectedStudent.name} ${selectedStudent.lastName}`,
        },
      ]);

      // Clear input fields
      setEventDetails({ start: "", end: "" });
      setEventModalOpen(false);
    }
  };

  const assignTeacherToStudent = (data) => {
    fetch(`${BACKEND_URL}/users/assignstudent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(errorText || "An error occurred");
          });
        }
        return response.json();
      })
      .then((data) => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleAssignClick = () => {
    if (selectedTeacher && selectedStudent && events.length > 0) {
      // Prepare data to be sent to the backend
      const eventsWithTeacherAndStudent = events.map((event) => ({
        ...event,
        teacherId: selectedTeacher.id,
        studentId: selectedStudent.id,
      }));

      assignTeacherToStudent({
        teacherId: selectedTeacher.id,
        studentId: selectedStudent.id,
        events: eventsWithTeacherAndStudent,
      });
      setEvents([]); // Clear events after assignment
    }
  };

  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).isValid()
      ? dayjs(dateTime).format("HH:mm")
      : "Invalid Date";
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Assign Student to Teacher</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Students List */}
        <div className="bg-white dark:bg-brand-dark-secondary p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">1. Select a Student</h3>
          <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {studentsWithoutTeacher.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No students available.</p>
            ) : (
              studentsWithoutTeacher.map((student) => (
                <div
                  key={student.id}
                  className={`p-3 border-l-4 rounded-md cursor-pointer mb-3 flex items-center gap-3 transition-all duration-200 ${
                    selectedStudent?.id === student.id
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/50 shadow-md"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-purple-300"
                  }`}
                  onClick={() => handleStudentSelect(student)}
                >
                  {student.avatarUrl ? (
                    <img
                      src={student.avatarUrl}
                      alt={`${student.name} ${student.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                      {`${student.name.charAt(0)}${student.lastName.charAt(0)}`}
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-800 dark:text-white">{`${student.name} ${student.lastName}`}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">{student.email}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Teachers List */}
        <div className="bg-white dark:bg-brand-dark-secondary p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">2. Select a Teacher</h3>
          <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className={`p-3 border-l-4 rounded-md cursor-pointer mb-3 flex items-center gap-3 transition-all duration-200 ${
                  selectedTeacher?.id === teacher.id
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/50 shadow-md"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-purple-300"
                }`}
                onClick={() => handleTeacherSelect(teacher)}
              >
                {teacher.avatarUrl ? (
                  <img
                    src={teacher.avatarUrl}
                    alt={`${teacher.name} ${teacher.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    {`${teacher.name.charAt(0)}${teacher.lastName.charAt(0)}`}
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-800 dark:text-white">{`${teacher.name} ${teacher.lastName}`}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 block">{teacher.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions and Scheduled Events */}
        <div className="bg-white dark:bg-brand-dark-secondary p-4 rounded-lg shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">3. Set Schedule</h3>
            <button
              onClick={handleCalendarOpen}
              disabled={!selectedTeacher || !selectedStudent}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2.5 px-4 rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              View Availability
            </button>
            <div className="mt-6 min-h-[100px]">
              {events.length > 0 && (
                <>
                  <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Scheduled Classes</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                    {events.map((event, index) => (
                      <li key={index}>
                        {`${dayjs(event.date).format("MMM DD, YYYY")} from ${formatDateTime(event.start)} - ${formatDateTime(event.end)}`}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
          <button
            onClick={handleAssignClick}
            disabled={!selectedTeacher || !selectedStudent || events.length === 0}
            className="w-full mt-4 bg-gradient-to-r from-green-500 to-teal-500 text-white py-2.5 px-4 rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Assign Student
          </button>
        </div>
      </div>

      {/* Calendar Modal */}
      {isCalendarOpen && (
        <div>
          {/* Modal Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-brand-dark-secondary w-full md:w-3/4 lg:w-1/2 rounded-lg shadow-lg p-4 max-w-4xl relative border border-gray-200 dark:border-purple-500/20">
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                onClick={() => setIsCalendarOpen(false)} // Close the modal
              >
                ✕
              </button>

              {/* Calendar */}
              <div className="w-[] h-auto">
                <Calendar
                  localizer={localizer}
                  events={teachersEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 400, width: "100%" }}
                  views={["month", "week"]}
                  selectable
                  onSelectSlot={handleSelectSlot}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {eventModalOpen && (
        <div>
          {/* Modal Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

          {/* Event Modal Content */}
          <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-brand-dark-secondary rounded-lg shadow-lg p-4 w-full max-w-md relative border border-gray-200 dark:border-purple-500/20">
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                onClick={handleEventModalClose} // Close the event modal
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-4 dark:text-white">Add Event</h2>

              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                    Start Time (HH:MM format, 24-hour)
                  </label>
                  <input
                    type="text"
                    placeholder="HH:MM"
                    name="start"
                    value={eventDetails.start}
                    onChange={handleEventDetailsChange}
                    className="border rounded w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-brand-dark dark:border-purple-500/20"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                    End Time (HH:MM format, 24-hour)
                  </label>
                  <input
                    type="text"
                    placeholder="HH:MM"
                    name="end"
                    value={eventDetails.end}
                    onChange={handleEventDetailsChange}
                    className="border rounded w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-brand-dark dark:border-purple-500/20"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddEvent}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Add Event
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentAssignment;
