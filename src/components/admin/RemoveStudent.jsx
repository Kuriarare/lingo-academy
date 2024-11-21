import { useState } from "react";
import avatar from "../../assets/logos/avatar.jpg";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


const RemoveStudent = ({ teachers }) => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Handle teacher selection
  const handleTeacherSelect = (teacher) => {
    console.log("Selected Teacher:", teacher);  // Log to verify the teacher data
    setSelectedTeacher(teacher);
  };

  // Handle student selection for removal
  const handleStudentSelect = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId) // Deselect if already selected
        : [...prev, studentId] // Select if not already selected
    );
  };

  // Remove selected students from teacher
  const removeStudents = () => {
    if (!selectedTeacher || selectedStudents.length === 0) return;

    fetch(`${BACKEND_URL}/users/removeStudentsFromTeacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId: selectedTeacher.id,   // Teacher's ID
          studentIds: selectedStudents,    // Selected student IDs
        }),
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
        // Handle success (e.g., update the UI, clear selections)
        alert("Students removed successfully");
        console.warn('This is the error:', data.message);
        setSelectedStudents([]); // Clear selected students
      })
      .catch((error) => {
        console.error("Error removing students:", error);
      });
  };

  return (
    <section className="flex flex-col md:flex-row gap-4 m-6 p-4 box-shadow-form">
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
              <span className="text-sm text-gray-500 block">{teacher.email}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Students List */}
      <div className="w-1/4 max-h-[12rem] overflow-y-auto">
        {selectedTeacher && selectedTeacher.students && selectedTeacher.students.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-4">Students</h2>
            {selectedTeacher.students.map((student) => (
              <div
                key={student.id}
                className={`p-2 border rounded-md cursor-pointer mb-2 flex items-center gap-2 ${
                  selectedStudents.includes(student.id) ? "bg-red-100" : ""
                }`}
                onClick={() => handleStudentSelect(student.id)}
              >
                <img
                  src={!student.avatarUrl ? avatar : student.avatarUrl}
                  alt={`${student.name} ${student.lastName}`}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <span className="font-medium">{`${student.name} ${student.lastName}`}</span>
                  <span className="text-sm text-gray-500 block">{student.email}</span>
                </div>
              </div>
            ))}
          </>
        )}
        {selectedTeacher && selectedTeacher.students && selectedTeacher.students.length === 0 && (
          <p>No students available for this teacher.</p>
        )}
      </div>

      {/* Remove Button */}
      <div className="flex flex-col justify-end">
        <button
          onClick={removeStudents}
          disabled={!selectedTeacher || selectedStudents.length === 0}
          className={`bg-red-600 text-white py-2 px-4 rounded-md ${
            !selectedTeacher || selectedStudents.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          Remove Selected Students
        </button>
      </div>
    </section>
  );
};

export default RemoveStudent;
