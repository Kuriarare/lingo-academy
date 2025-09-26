// src/data/joinClassHandler.js

/**
 * Handles joining a class.
 *
 * @param {object} params - An object with the following properties:
 *   @param {object} params.user - The logged-in user from Redux.
 *   @param {object} params.classSession - The class session the user is joining.
 *   @param {function} params.navigate - The navigate function from react-router-dom.
 *   @param {boolean} [params.editingEvent] - (Optional) If true, edit mode is active.
 *   @param {function} [params.handleEventEdit] - (Optional) Callback to handle event editing.
 *   @param {function} [params.setIsModalOpen] - (Optional) Function to open a modal.
 */
export const handleJoinClass = ({
    user,
    classSession,
    navigate,
    editingEvent = false,
    handleEventEdit = () => {},
    setIsModalOpen = () => {},
  }) => {
    if (editingEvent) {
      handleEventEdit(classSession);
      setIsModalOpen(true);
    } else {
      let roomId;
      if (user.role === "user") {
        // For students, use the student's own id as the room id.
        roomId = user.id;
      } else {
        // For teachers, look up the student in the teacher's students array.
        const student = user.students?.find((s) => s.id === classSession.studentId);
        roomId = student ? student.id : classSession.studentId;
      }
      const userName = user.name;
      const email = user.email;
      navigate("/classroom", {
        state: { roomId, userName, email, fromMeeting: false },
      });
    }
  };
  