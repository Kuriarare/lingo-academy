import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import avatar from "../../assets/logos/avatar.jpg";
import { removeStudent } from "../../redux/userSlice";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


const RemoveStudent = ({ teachers }) => {
  const dispatch = useDispatch();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Handle teacher selection
  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
  };

  // Handle student selection for removal
  const handleStudentSelect = (studentId) => {
    setSelectedStudent((prev) => (prev === studentId ? null : studentId));
  };

  // Remove selected students from teacher
  const removeStudents = () => {
    if (!selectedTeacher || !selectedStudent) return;

    Promise.all([
      fetch(`${BACKEND_URL}/users/removeStudentsFromTeacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId: selectedTeacher.id,
          studentIds: [selectedStudent],
        }),
      }),
      fetch(`${BACKEND_URL}/chat/delete-chats-by-student/${selectedStudent}`, {
        method: "DELETE",
      }),
    ])
      .then(async ([studentsResponse, chatResponse]) => {
        if (!studentsResponse.ok) {
          const errorText = await studentsResponse.text();
          throw new Error(
            `Failed to remove students: ${errorText || "An error occurred"}`
          );
        }
        if (!chatResponse.ok) {
          const errorText = await chatResponse.text();
          throw new Error(
            `Failed to delete chats: ${errorText || "An error occurred"}`
          );
        }
        return Promise.all([studentsResponse.json(), chatResponse.json()]);
      })
      .then(([studentsData, chatData]) => {
        Swal.fire({
          title: "Success!",
          text: "Students and their chats removed successfully.",
          icon: "success",
          confirmButtonText: "Ok",
        });
        console.log("Students removed:", studentsData.message);
        console.log(
          `Chats deleted: ${chatData.chatsDeleted}, Archived chats deleted: ${chatData.archivedChatsDeleted}`
        );
        if (selectedStudent) {
         dispatch(removeStudent(selectedStudent));
        }
        setSelectedStudent(null);
      })
      .catch((error) => {
        console.error("Error in removal process:", error);
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonText: "Ok",
        });
      });
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Remove Student from Teacher</h2>
      <div className="flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teachers List */}
          <div className="bg-white dark:bg-brand-dark-secondary p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">1. Select a Teacher</h3>
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

          {/* Students List */}
          <div className="bg-white dark:bg-brand-dark-secondary p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">2. Select Students to Remove</h3>
            <div className="max-h-64 h-64 overflow-y-auto pr-2 custom-scrollbar">
              {selectedTeacher ? (
                selectedTeacher.students && selectedTeacher.students.length > 0 ? (
                  selectedTeacher.students.map((student) => (
                    <div
                      key={student.id}
                      className={`p-3 border-l-4 rounded-md cursor-pointer mb-3 flex items-center gap-3 transition-all duration-200 ${
                        selectedStudent === student.id
                          ? "border-red-500 bg-red-50 dark:bg-red-900/50 shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-red-300"
                      }`}
                      onClick={() => handleStudentSelect(student.id)}
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
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center mt-10">No students assigned to this teacher.</p>
                )
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center mt-10">Please select a teacher to see their students.</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={removeStudents}
            disabled={!selectedTeacher || !selectedStudent}
            className="w-1/2 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2.5 px-4 rounded-lg shadow-md hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Remove Selected Students
          </button>
        </div>
      </div>
    </section>
  );
};

export default RemoveStudent;
