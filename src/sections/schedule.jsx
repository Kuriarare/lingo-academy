import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import Dashboard from "../sections/dashboard";
import Navbar from "../components/navbar";
import ChatWindow from "../components/chatWindow";
import MainChat from "../components/buttons/chatList";
import useFormattedEvents from "../hooks/useFormattedEvents";
import useEventEdit from "../hooks/useEventEdit";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const engRoom = "English Teachers Meeting";
const spaRoom = "Spanish Teachers Meeting";
const polRoom = "Polish Teachers Meeting";

const teacherChats = {
  english: {
    id: "uuid-teacher-english",
    name: "Teachers Chat - English",
    type: "teacher",
  },
  spanish: {
    id: "uuid-teacher-spanish",
    name: "Teachers Chat - Spanish",
    type: "teacher",
  },
  polish: {
    id: "uuid-teacher-polish",
    name: "Teachers Chat - Polish",
    type: "teacher",
  },
};

const Schedule = () => {
  const user = useSelector((state) => state.user.userInfo.user);
  console.log("User:", user);
  const header = "MY SCHEDULE";
  const [teacherChat, setTeacherChat] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState({});
  const [chatRoom, setChatRoom] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(false);

  const navigate = useNavigate();

  const events = useFormattedEvents(user);

  const {
    eventDetails,
    handleEventEdit,
    handleEventDetailsChange,
    handleSubmitEvent,
    openModalFrom,
    setOpenModalFrom,
    handleSelectSlot, 
  } = useEventEdit();

  useEffect(() => {
    if (user.role === "teacher") {
      setTeacherChat(user.students);
      setTeacherInfo(user.teacher);
      setChatRoom(user.id);
    } else if (user.role === "user") {
      setChatRoom(user.id);
    }

    // If events are loaded or empty, stop loading
    if (events !== undefined) {
      setLoading(false); // Only set loading to false if events are fetched (whether empty or full)
    }
  }, [user, events]); // Dependencies for `user` and `events` updates

  const localizer = dayjsLocalizer(dayjs);

  const CustomEvent = ({ event }) => (
    <div className="flex items-center justify-center text-center h-full text-[13px] flex-wrap">
      <span>{event.title}</span>
    </div>
  );

  const handleEventClick = (event) => {
    if (editingEvent) {
      handleEventEdit(event); 
      setIsModalOpen(true); 
    } else {
      // If not editing, navigate to the class
      const roomId = event.studentId; // Assuming studentId is passed in the event
      const userName = user.name;
      const email = user.email;
      navigate("/classroom", {
        state: { roomId, userName, email, fromMeeting: false },
      });
    }
  };


  const handleJoinMeeting = (roomName) => {
    const userName = user.name;
    const email = user.email;

    // Map the roomName to the teacherChats IDs
    let roomId = "";
    if (roomName === engRoom) roomId = teacherChats.english.id;
    if (roomName === spaRoom) roomId = teacherChats.spanish.id;
    if (roomName === polRoom) roomId = teacherChats.polish.id;

    navigate("/classroom", {
      state: { roomId, userName, email, fromMeeting: true },
    });
  };

  return (
    <div className="flex w-full relative h-[97vh]">
      <Dashboard />
      <div className="w-full">
        <section className="w-full custom-bg">
          <div className="container">
            <Navbar header={header} />
          </div>
        </section>

        {/* Show loading if events are being fetched */}
        {loading && events === undefined ? (
          <section className="dots-container">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </section>
        ) : (
          <section className="mt-4 lg:flex pr-2 lg:pl:0 pl-2">
            <div className="lg:w-3/4 mx-4 h-[600px] lg:mb-0 mb-10">
              {events.length > 0 ? (
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  defaultView="week"
                  step={60} // Step size of 60 minutes
                  timeslots={1} // Show each minute slot
                  components={{
                    event: CustomEvent,
                  }}
                  eventPropGetter={() => ({
                    style: {
                      backgroundColor: "#273296",
                      color: "white",
                      borderRadius: "5px",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  })}
                  formats={{
                    eventTimeRangeFormat: () => "",
                  }}
                  onSelectEvent={handleEventClick}
                />
              ) : (
                <div>No events found.</div>
              )}
              <div className="flex justify-between">
                <h2>*Click on an event to join the class directly*</h2>
                {/* Teachers Meeting button appears after loading */}
                {!loading &&
                  (user.role === "teacher" || user.role === "admin") && (
                    <section className="flex justify-end m-3 gap-8">
                      {user.role === "teacher" && (
                        <button
                          className="button-69 mt-2"
                          onClick={() => {
                            setEditingEvent((prev) => !prev)
                            alert("Select the name/event you want to edit from your calendar and then select the date and time you want to edit it to.");
                          }} 
                        >
                          {editingEvent
                            ? "Select an event to edit"
                            : "Edit Event"}
                        </button>
                      )}
                    </section>
                  )}
              </div>
            </div>

            <div>
              {user.role === "teacher" ? (
                <MainChat
                  username={user.name}
                  teacherChat={teacherChat}
                  email={user.email}
                />
              ) : (
                <ChatWindow
                  username={user.name}
                  room={chatRoom}
                  email={user.email}
                  peerInfo={teacherInfo}
                />
              )}
            </div>
          </section>
        )}

        {/* Teachers Meeting button appears after loading */}
        {!loading && (user.role === "teacher" || user.role === "admin") && (
          <section className="flex justify-end m-3 gap-8">
            {/* Display buttons based on role and language */}
            {user.role === "admin" && (
              <>
                <button
                  onClick={() => handleJoinMeeting(engRoom)}
                  className="button-69"
                  role="button"
                >
                  Teachers Meeting - English
                </button>
                <button
                  onClick={() => handleJoinMeeting(spaRoom)}
                  className="button-69"
                  role="button"
                >
                  Teachers Meeting - Spanish
                </button>
                <button
                  onClick={() => handleJoinMeeting(polRoom)}
                  className="button-69"
                  role="button"
                >
                  Teachers Meeting - Polish
                </button>
              </>
            )}

            {/* For teacher, show the appropriate button based on language */}
            {user.role === "teacher" && (
              <>
                {user.language.includes("english") && (
                  <button
                    onClick={() => handleJoinMeeting(engRoom)}
                    className="button-69"
                    role="button"
                  >
                    Teachers Meeting - English
                  </button>
                )}
                {user.language.includes("spanish") && (
                  <button
                    onClick={() => handleJoinMeeting(spaRoom)}
                    className="button-69"
                    role="button"
                  >
                    Teachers Meeting - Spanish
                  </button>
                )}
                {user.language.includes("polish") && (
                  <button
                    onClick={() => handleJoinMeeting(polRoom)}
                    className="button-69"
                    role="button"
                  >
                    Teachers Meeting - Polish
                  </button>
                )}
              </>
            )}
          </section>
        )}

        {/* Modal - Form to edit the event */}
        {isModalOpen && (
          <div className="modal-overlay relative">
            <div className="modal-content">
              <h3>Edit Event</h3>
              <div className="calendar-container">
                {/* Mini Calendar for selecting a date */}
                <Calendar
                  localizer={localizer}
                  startAccessor="start"
                  endAccessor="end"
                  defaultView="week"
                  step={60} // Step size of 60 minutes
                  timeslots={1} // Show each minute slot
                  eventPropGetter={() => ({
                    style: {
                      backgroundColor: "#273296",
                      color: "white",
                      borderRadius: "5px",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  })}
                  formats={{
                    eventTimeRangeFormat: () => "",
                  }}
                  onSelectEvent={handleEventClick}
                  selectable
                  onSelectSlot={handleSelectSlot}
                />
                {/* <Calendar
                  localizer={localizer}
                  events={events}
                  defaultView="month"
                  views={["month"]}
                  onSelectSlot={({ start }) => setSelectedDate(start)}
                /> */}
              </div>

              {/* Form to edit the event */}
              { openModalFrom && (
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
                        value={eventDetails.start || ""}
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
                        value={eventDetails.end || ""}
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
                      type="submit"
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
        )}
      </div>
    </div>
  );
};

export default Schedule;
