import { useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import avatar from "../assets/logos/avatar.jpg";
const LOCAL_HOST = "http://localhost:8000";

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

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  const handleCalendarOpen = () => {
    if (selectedTeacher.teacherSchedules) {
      const endDate = dayjs().add(1, "month");

      const formattedEvents = selectedTeacher.teacherSchedules.flatMap(
        (event) => {
          const startTime = dayjs(
            `${event.date} ${event.startTime}`,
            "YYYY-MM-DD HH:mm"
          );
          const endTime = dayjs(
            `${event.date} ${event.endTime}`,
            "YYYY-MM-DD HH:mm"
          );

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
    setSelectedDate(start);
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
      const startDateTime = dayjs(selectedDate)
        .hour(parseInt(eventDetails.start.split(":")[0], 10))
        .minute(parseInt(eventDetails.start.split(":")[1], 10))
        .second(0)
        .millisecond(0)
        .toDate();

      const endDateTime = dayjs(selectedDate)
        .hour(parseInt(eventDetails.end.split(":")[0], 10))
        .minute(parseInt(eventDetails.end.split(":")[1], 10))
        .second(0)
        .millisecond(0)
        .toDate();

      const dayOfWeek = dayjs(selectedDate).format("dddd");
      const date = dayjs(selectedDate).format("YYYY-MM-DD"); // Format the date for sending

      // Add the new event to the events array, with both teacher and student names
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

      setEventDetails({ start: "", end: "" });
      setEventModalOpen(false);
    }
  };

  // https://srv570363.hstgr.cloud:8000

  const assignTeacherToStudent = (data) => {
    fetch(`${LOCAL_HOST}/users/assignstudent`, {
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
      assignTeacherToStudent({
        teacherId: selectedTeacher.id,
        studentId: selectedStudent.id,
        events,
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
    <section className="flex flex-col md:flex-row gap-4 m-6 p-4 box-shadow-form">
      {/* Students List */}
      <div className="w-1/4 max-h-[12rem] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Students</h2>
        {students.map((student) => (
          <div
            key={student.id}
            className={`p-2 border rounded-md cursor-pointer mb-2 flex items-center gap-2 ${
              selectedStudent?.id === student.id ? "bg-blue-100" : ""
            }`}
            onClick={() => handleStudentSelect(student)}
          >
            <img
              src={!student.avatarUrl ? avatar : student.avatarUrl}
              alt={`${student.name} ${student.lastName}`}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <span className="font-medium">{`${student.name} ${student.lastName}`}</span>
              <span className="text-sm text-gray-500 block">
                {student.email}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Teachers List */}
      <div className="w-1/4 max-h-[12rem] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Teachers</h2>
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className={`p-2 border rounded-md cursor-pointer mb-2 flex items-center gap-2 ${
              selectedTeacher?.id === teacher.id ? "bg-blue-100" : ""
            }`}
            onClick={() => handleTeacherSelect(teacher)}
          >
            <img
              src={!teacher.avatarUrl ? avatar : teacher.avatarUrl}
              alt={`${teacher.name} ${teacher.lastName}`}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <span className="font-medium">{`${teacher.name} ${teacher.lastName}`}</span>
              <span className="text-sm text-gray-500 block">
                {teacher.email}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-end">
        <button
          onClick={handleCalendarOpen}
          disabled={!selectedTeacher || !selectedStudent}
          className={`bg-blue-600 text-white py-2 px-4 rounded-md ${
            !selectedTeacher || !selectedStudent
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          Availability
        </button>
      </div>

      {/* Calendar Modal */}
      {isCalendarOpen && (
        <div>
          {/* Modal Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-6xl relative">
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsCalendarOpen(false)} // Close the modal
              >
                ✕
              </button>

              {/* Calendar */}
              <div className="w-full h-auto">
                <Calendar
                  localizer={localizer}
                  events={teachersEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 750, width: "100%" }}
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
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md relative">
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={handleEventModalClose} // Close the event modal
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-4">Add Event</h2>

              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="start"
                    value={eventDetails.start}
                    onChange={handleEventDetailsChange}
                    className="border rounded w-full py-2 px-3 text-gray-700"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="end"
                    value={eventDetails.end}
                    onChange={handleEventDetailsChange}
                    className="border rounded w-full py-2 px-3 text-gray-700"
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

      {events.length > 0 && (
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-xl font-bold">Scheduled Events</h2>
          <ul className="list-disc ml-6">
            {events.map((event, index) => (
              <li key={index}>
                {`${dayjs(event.date).format(
                  "MMM DD, YYYY"
                )} from ${formatDateTime(event.start)} - ${formatDateTime(
                  event.end
                )}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Assign Button */}
      <div className="flex flex-col justify-end">
        <button
          onClick={handleAssignClick}
          disabled={!selectedTeacher || !selectedStudent || events.length === 0}
          className={`bg-blue-600 text-white py-2 px-4 rounded-md ${
            !selectedTeacher || !selectedStudent || events.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          Assign
        </button>
      </div>
    </section>
  );
};

export default StudentAssignment;
