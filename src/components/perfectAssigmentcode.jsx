// import { useState } from "react";
// import { Calendar, dayjsLocalizer } from "react-big-calendar";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import dayjs from "dayjs";
// import avatar from "../assets/logos/avatar.jpg";

// const StudentAssignment = ({ teachers, students }) => {
//   const [selectedTeacher, setSelectedTeacher] = useState(null);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [eventModalOpen, setEventModalOpen] = useState(false);
//   const [events, setEvents] = useState([]);
//   const [eventDetails, setEventDetails] = useState({ start: "", end: "" });

//   const localizer = dayjsLocalizer(dayjs);

//   const handleTeacherSelect = (teacher) => {
//     setSelectedTeacher(teacher);
//   };

//   const handleStudentSelect = (student) => {
//     setSelectedStudent(student);
//   };

//   const handleCalendarOpen = () => {
//     setIsCalendarOpen(!isCalendarOpen);
//   };

//   const handleSelectSlot = ({ start }) => {
//     setSelectedDate(start);
//     setEventModalOpen(true); // Open the event modal
//   };

//   const handleEventModalClose = () => {
//     setEventModalOpen(false);
//   };

//   const handleEventDetailsChange = (e) => {
//     const { name, value } = e.target;
//     setEventDetails((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddEvent = () => {
//     if (selectedDate && eventDetails.start && eventDetails.end) {
//       // Combine the selected date with the start and end times
//       const startDateTime = dayjs(selectedDate)
//         .hour(parseInt(eventDetails.start.split(":")[0], 10))
//         .minute(parseInt(eventDetails.start.split(":")[1], 10))
//         .second(0) // Ensure seconds are zero
//         .millisecond(0) // Ensure milliseconds are zero
//         .toDate();

//       const endDateTime = dayjs(selectedDate)
//         .hour(parseInt(eventDetails.end.split(":")[0], 10))
//         .minute(parseInt(eventDetails.end.split(":")[1], 10))
//         .second(0) // Ensure seconds are zero
//         .millisecond(0) // Ensure milliseconds are zero
//         .toDate();

//       setEvents((prev) => [
//         ...prev,
//         { start: startDateTime, end: endDateTime, date: selectedDate },
//       ]);

//       // Log the updated events list
//       console.log("Updated Events:", [
//         ...events,
//         { start: startDateTime, end: endDateTime, date: selectedDate },
//       ]);

//       setEventDetails({ start: "", end: "" });
//       setEventModalOpen(false);
//     }
//   };

//   const assignTeacherToStudent = (data) => {
//     // Implement assignment logic here
//     console.log("Assignment data:", data);
//   };

//   const handleAssignClick = () => {
//     if (selectedTeacher && selectedStudent) {
//       assignTeacherToStudent({
//         teacherId: selectedTeacher._id,
//         studentId: selectedStudent._id,
//         events,
//       });
//       setEvents([]); // Clear events after assignment
//     }
//   };

//   const formatDateTime = (dateTime) => {
//     return dayjs(dateTime).isValid()
//       ? dayjs(dateTime).format("HH:mm")
//       : "Invalid Date";
//   };

//   return (
//     <section className="flex flex-col md:flex-row gap-4 m-6 p-4 box-shadow-form">
//       {/* Students List */}
//       <div className="w-1/4 max-h-[12rem] overflow-y-auto">
//         <h2 className="text-xl font-bold mb-4">Students</h2>
//         {students.map((student) => (
//           <div
//             key={student._id}
//             className={`p-2 border rounded-md cursor-pointer mb-2 flex items-center gap-2 ${
//               selectedStudent?._id === student._id ? "bg-blue-100" : ""
//             }`}
//             onClick={() => handleStudentSelect(student)}
//           >
//             <img
//               src={!student.avatarUrl ? avatar : student.avatarUrl}
//               alt={`${student.name} ${student.lastName}`}
//               className="w-8 h-8 rounded-full"
//             />
//             <div>
//               <span className="font-medium">{`${student.name} ${student.lastName}`}</span>
//               <span className="text-sm text-gray-500 block">
//                 {student.email}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//       {/* Teachers List */}
//       <div className="w-1/4 max-h-[12rem] overflow-y-auto">
//         <h2 className="text-xl font-bold mb-4">Teachers</h2>
//         {teachers.map((teacher) => (
//           <div
//             key={teacher._id}
//             className={`p-2 border rounded-md cursor-pointer mb-2 flex items-center gap-2 ${
//               selectedTeacher?._id === teacher._id ? "bg-blue-100" : ""
//             }`}
//             onClick={() => handleTeacherSelect(teacher)}
//           >
//             <img
//               src={!teacher.avatarUrl ? avatar : teacher.avatarUrl}
//               alt={`${teacher.name} ${teacher.lastName}`}
//               className="w-8 h-8 rounded-full"
//             />
//             <div>
//               <span className="font-medium">{`${teacher.name} ${teacher.lastName}`}</span>
//               <span className="text-sm text-gray-500 block">
//                 {teacher.email}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="flex flex-col justify-end">
//         <button
//           onClick={handleCalendarOpen}
//           disabled={!selectedTeacher || !selectedStudent}
//           className={`bg-blue-600 text-white py-2 px-4 rounded-md ${
//             !selectedTeacher || !selectedStudent
//               ? "opacity-50 cursor-not-allowed"
//               : "cursor-pointer"
//           }`}
//         >
//           Availability
//         </button>
//       </div>

//       {/* Calendar Modal */}
//       {isCalendarOpen && (
//         <div>
//           {/* Modal Overlay */}
//           <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

//           {/* Modal Content */}
//           <div className="fixed inset-0 z-50 flex justify-center items-center">
//             <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl relative">
//               {/* Close Button */}
//               <button
//                 className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//                 onClick={() => setIsCalendarOpen(false)} // Close the modal
//               >
//                 ✕
//               </button>

//               {/* Calendar */}
//               <div className="w-full h-auto">
//                 <Calendar
//                   localizer={localizer}
//                   events={events.map((event) => ({
//                     ...event,
//                     start: new Date(event.start),
//                     end: new Date(event.end),
//                   }))}
//                   startAccessor="start"
//                   endAccessor="end"
//                   style={{ height: 500 }}
//                   views={["month", "week"]}
//                   selectable
//                   onSelectSlot={handleSelectSlot}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Event Modal */}
//       {eventModalOpen && (
//         <div>
//           {/* Modal Overlay */}
//           <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

//           {/* Event Modal Content */}
//           <div className="fixed inset-0 z-50 flex justify-center items-center">
//             <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md relative">
//               {/* Close Button */}
//               <button
//                 className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//                 onClick={handleEventModalClose} // Close the event modal
//               >
//                 ✕
//               </button>

//               <h2 className="text-xl font-bold mb-4">Add Event</h2>

//               <form>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 text-sm font-bold mb-2">
//                     Start Time
//                   </label>
//                   <input
//                     type="time"
//                     name="start"
//                     value={eventDetails.start}
//                     onChange={handleEventDetailsChange}
//                     className="border rounded w-full py-2 px-3 text-gray-700"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 text-sm font-bold mb-2">
//                     End Time
//                   </label>
//                   <input
//                     type="time"
//                     name="end"
//                     value={eventDetails.end}
//                     onChange={handleEventDetailsChange}
//                     className="border rounded w-full py-2 px-3 text-gray-700"
//                     required
//                   />
//                 </div>
//                 <button
//                   type="button"
//                   onClick={handleAddEvent}
//                   className="bg-blue-600 text-white py-2 px-4 rounded-md"
//                 >
//                   Add Event
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {events.length > 0 && (
//         <div className="flex flex-col gap-4 mt-4">
//           <h2 className="text-xl font-bold">Scheduled Events</h2>
//           <ul className="list-disc ml-6">
//             {events.map((event, index) => (
//               <li key={index}>
//                 {`${dayjs(event.date).format(
//                   "MMM DD, YYYY"
//                 )} from ${formatDateTime(event.start)} - ${formatDateTime(
//                   event.end
//                 )}`}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Assign Button */}
//       <div className="flex flex-col justify-end">
//         <button
//           onClick={handleAssignClick}
//           disabled={!selectedTeacher || !selectedStudent || events.length === 0}
//           className={`bg-blue-600 text-white py-2 px-4 rounded-md ${
//             !selectedTeacher || !selectedStudent || events.length === 0
//               ? "opacity-50 cursor-not-allowed"
//               : "cursor-pointer"
//           }`}
//         >
//           Assign
//         </button>
//       </div>
//     </section>
//   );
// };

// export default StudentAssignment;
