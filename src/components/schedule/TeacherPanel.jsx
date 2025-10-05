import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import RemoveStudentModal from "./RemoveStudentModal";
import AddEventModal from "./AddEventModal";
import { removeStudent, updateUserEvents } from "../../redux/userSlice";

const TeacherPanel = ({ students, events, teacherId, teacherName }) => {
  const dispatch = useDispatch();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const handleStudentSelect = (student) => {
    const studentEvents = events.filter(
      (event) => event.studentId === student.id
    );
    setSelectedStudent({ ...student, events: studentEvents });
  };

  const getInitials = (name, lastName) => {
    const firstInitial = name ? name.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const generateColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 75%, 60%)`;
    return color;
  };

  const handleRemoveStudent = async ({ events, removeAll }) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      if (removeAll) {
        const [removeStudentResponse, chatResponse] = await Promise.all([
          fetch(`${BACKEND_URL}/users/removeStudentsFromTeacher`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              teacherId: teacherId,
              studentIds: [selectedStudent.id],
            }),
          }),
          fetch(
            `${BACKEND_URL}/chat/delete-chats-by-student/${selectedStudent.id}`,
            {
              method: "DELETE",
            }
          ),
        ]);

        if (removeStudentResponse.ok && chatResponse.ok) {
          Swal.fire({
            title: "Success!",
            text: "Student and their chats removed successfully.",
            icon: "success",
            confirmButtonText: "Ok",
          }).then(() => {
           if (selectedStudent && selectedStudent.id) {
             dispatch(removeStudent(selectedStudent.id));
           }
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Error removing student or chats.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      } else {
        console.log('Sending data to removeEvents:', {
          eventIds: events,
          teacherId: selectedStudent.teacherId,
          studentId: selectedStudent.id,
        });
        const response = await fetch(`${BACKEND_URL}/users/removeEvents`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventIds: events,
            teacherId: teacherId,
            studentId: selectedStudent.id,
          }),
        });

        if (response.ok) {
          Swal.fire({
            title: "Success!",
            text: "Selected events removed successfully.",
            icon: "success",
            confirmButtonText: "Ok",
          }).then(() => {
           if (selectedStudent && selectedStudent.id) {
             const updatedEvents = selectedStudent.events
               .filter(event => !events.includes(event.id))
               .map(event => ({
                 ...event,
                 start: new Date(event.start).toISOString(),
                 end: new Date(event.end).toISOString(),
               }));
             dispatch(updateUserEvents({ studentId: selectedStudent.id, updatedEvents }));
           }
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Error removing events.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
    setIsRemoveModalOpen(false);
  };

  const handleAddEvent = async (eventDetails) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await fetch(`${BACKEND_URL}/users/add-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventDetails),
      });

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Event added successfully.",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(async (result) => {
         if (result.isConfirmed) {
           try {
             const newEvent = await response.json();
             const serializedEvent = {
               ...newEvent,
               start: new Date(newEvent.start).toISOString(),
               end: new Date(newEvent.end).toISOString(),
             };
             const updatedEvents = [...selectedStudent.events, serializedEvent].map(event => ({
               ...event,
               start: new Date(event.start).toISOString(),
               end: new Date(event.end).toISOString(),
             }));
             dispatch(updateUserEvents({ studentId: selectedStudent.id, updatedEvents }));
           } catch (error) {
             console.error("Failed to parse JSON, state will not be updated:", error);
           }
         }
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Error adding event.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-brand-dark-secondary p-4 rounded-lg shadow-sm mt-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
        Teacher Panel
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Students
          </h4>
          <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {students.map((student) => {
              const initials = getInitials(student.name, student.lastName);
              const avatarColor = generateColor(student.name);
              return (
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
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {initials}
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-800 dark:text-white">{`${student.name} ${student.lastName}`}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">
                      {student.email}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Actions
          </h4>
          <div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              disabled={!selectedStudent}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2.5 px-4 rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Event
            </button>
            <button
              onClick={() => setIsRemoveModalOpen(true)}
              disabled={!selectedStudent}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2.5 px-4 rounded-lg shadow-md hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove Student/Events
            </button>
            {!selectedStudent && (
              <p className="text-gray-500 dark:text-gray-400 text-center mt-4">
                Select a student to see available actions.
              </p>
            )}
          </div>
        </div>
      </div>
      <RemoveStudentModal
        student={selectedStudent}
        teacher={selectedStudent?.teacher}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleRemoveStudent}
        isOpen={isRemoveModalOpen}
      />
      <AddEventModal
        student={selectedStudent}
        teacherId={teacherId}
        teacherName={teacherName}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddEvent}
        isOpen={isAddModalOpen}
      />
    </div>
  );
};

export default TeacherPanel;