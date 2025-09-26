import React from 'react';
import { Calendar } from 'react-big-calendar';

const EditEventModal = ({
  isModalOpen,
  localizer,
  handleEventClick,
  handleSelectSlot,
  openModalFrom,
  handleSubmitEvent,
  eventDetails,
  handleEventDetailsChange,
  setOpenModalFrom,
  setIsModalOpen,
  setEditingEvent,
}) => {
  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay relative">
      <div className="modal-content">
        <h3>Edit Event</h3>
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            step={60}
            timeslots={1}
            eventPropGetter={() => ({
              style: {
                backgroundColor: '#273296',
                color: 'white',
                borderRadius: '5px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
            })}
            formats={{
              eventTimeRangeFormat: () => '',
            }}
            onSelectEvent={handleEventClick}
            selectable
            onSelectSlot={handleSelectSlot}
          />
        </div>

        {openModalFrom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <form onSubmit={handleSubmitEvent}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Start Time (HH:MM format, 24-hour)
                  </label>
                  <input
                    type="text"
                    placeholder="HH:MM"
                    name="start"
                    value={eventDetails.start || ''}
                    onChange={handleEventDetailsChange}
                    className="border rounded w-full py-2 px-3 text-gray-700"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    End Time (HH:MM format, 24-hour)
                  </label>
                  <input
                    type="text"
                    placeholder="HH:MM"
                    name="end"
                    value={eventDetails.end || ''}
                    onChange={handleEventDetailsChange}
                    className="border rounded w-full py-2 px-3 text-gray-700"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md w-full"
                >
                  Update Event
                </button>
                <button
                  type="button"
                  className="bg-red-600 text-white mt-2 py-2 px-4 rounded-md w-full"
                  onClick={() => setOpenModalFrom(false)}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        )}

        <button
          className="button-69 mt-2"
          onClick={() => {
            setIsModalOpen(false);
            setEditingEvent(false);
          }}
        >
          Close Modal
        </button>
      </div>
    </div>
  );
};

export default EditEventModal;