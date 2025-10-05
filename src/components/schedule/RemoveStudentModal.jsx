import { useState, useEffect } from "react";
import dayjs from "dayjs";

const RemoveStudentModal = ({ student, teacher, onClose, onConfirm, isOpen }) => {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [removeAll, setRemoveAll] = useState(false);
  const [uniqueEvents, setUniqueEvents] = useState([]);

  useEffect(() => {
    if (isOpen && student && student.events) {
      const groupedEvents = student.events.reduce((acc, event) => {
        const day = dayjs(event.start).format("dddd");
        const time = dayjs(event.start).format("h:mm A");
        const key = `${day}-${time}`;
        if (!acc[key]) {
          acc[key] = { ...event, day, time };
        }
        return acc;
      }, {});
      const uniqueEventsList = Object.values(groupedEvents);
      setUniqueEvents(uniqueEventsList);
      // Initialize all slots as unselected
      setSelectedSlots([]);
    } else if (!isOpen) {
      // Reset state when modal is closed
      setUniqueEvents([]);
      setSelectedSlots([]);
      setRemoveAll(false);
    }
  }, [isOpen, student]);

  if (!student || !isOpen) {
    return null;
  }

  const handleSlotSelection = (slotKey) => {
    setSelectedSlots((prev) =>
      prev.includes(slotKey)
        ? prev.filter((key) => key !== slotKey)
        : [...prev, slotKey]
    );
  };

  const handleConfirm = () => {
    // Find all event IDs that correspond to the selected time slots
    const selectedEventIds = student.events
      .filter((event) => {
        const day = dayjs(event.start).format("dddd");
        const time = dayjs(event.start).format("h:mm A");
        const slotKey = `${day}-${time}`;
        return selectedSlots.includes(slotKey);
      })
      .map((event) => event.eventId);
    onConfirm({ events: selectedEventIds, removeAll });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-brand-dark-secondary p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Remove {student.name} {student.lastName}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You can either remove the student completely (which will delete all
          their events and chats) or remove only selected events.
        </p>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="removeAll"
            checked={removeAll}
            onChange={() => setRemoveAll(!removeAll)}
            className="form-checkbox h-5 w-5 text-purple-600"
          />
          <label
            htmlFor="removeAll"
            className="ml-2 text-gray-800 dark:text-white"
          >
            Remove student completely
          </label>
        </div>
        {!removeAll && (
          <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar mb-6">
            {uniqueEvents.map((event) => {
              const slotKey = `${event.day}-${event.time}`;
              return (
                <div
                  key={slotKey}
                  className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700"
                >
                  <span className="text-gray-800 dark:text-white">
                    {event.day} at {event.time}
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedSlots.includes(slotKey)}
                    onChange={() => handleSlotSelection(slotKey)}
                    className="form-checkbox h-5 w-5 text-purple-600"
                  />
                </div>
              );
            })}
          </div>
        )}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Confirm Removal
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveStudentModal;