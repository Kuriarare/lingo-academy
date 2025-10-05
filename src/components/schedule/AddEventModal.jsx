import { useState } from "react";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const AddEventModal = ({
  student,
  teacherId,
  teacherName,
  onClose,
  onConfirm,
  isOpen,
}) => {
  const [eventDetails, setEventDetails] = useState({
    date: "",
    start: "",
    end: "",
  });

  if (!student || !isOpen) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { date, start, end } = eventDetails;
    const timePattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/; // HH:MM format

    if (!date || !start || !end) {
      Swal.fire("Error", "Please fill in all fields.", "error");
      return;
    }

    if (!timePattern.test(start) || !timePattern.test(end)) {
      Swal.fire(
        "Invalid Time Format",
        "Please use HH:MM format for start and end times.",
        "warning"
      );
      return;
    }

    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    const startDateTime = dayjs(date)
      .hour(startHours)
      .minute(startMinutes)
      .second(0);
    const endDateTime = dayjs(date)
      .hour(endHours)
      .minute(endMinutes)
      .second(0);

    const payload = {
      studentId: student.id,
      teacherId: teacherId,
      studentName: `${student.name} ${student.lastName}`,
      teacherName: teacherName,
      initialDateTime: startDateTime.toDate(),
      startTime: startDateTime.toDate(),
      endTime: endDateTime.toDate(),
      dayOfWeek: startDateTime.format("dddd"),
    };
    onConfirm(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-brand-dark-secondary p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Add Event for {student.name} {student.lastName}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={eventDetails.date}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-brand-dark dark:border-purple-500/20 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Time (HH:MM)
            </label>
            <input
              type="text"
              name="start"
              placeholder="HH:MM"
              value={eventDetails.start}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-brand-dark dark:border-purple-500/20 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Time (HH:MM)
            </label>
            <input
              type="text"
              name="end"
              placeholder="HH:MM"
              value={eventDetails.end}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-brand-dark dark:border-purple-500/20 dark:text-white"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;