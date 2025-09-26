import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import Dashboard from "../../sections/dashboard";
import Navbar from "../navbar";
import ChatWindow from "../chatWindow";
import MainChat from "../buttons/chatList";
import useFormattedEvents from "../../hooks/useFormattedEvents";
import useEventEdit from "../../hooks/useEventEdit";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import CustomToolbar from "../customToolBar";
import {
  fetchMessagesForTeacher,
  fetchUnreadCountsForStudent,
} from "../../redux/chatSlice";
import { io } from "socket.io-client";
import { meetingRooms, teacherChats } from "../../constants";
import EditEventModal from "./EditEventModal";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Schedule = () => {
  const user = useSelector((state) => state.user.userInfo.user);
  const header = "MY SCHEDULE";
  const [teacherChat, setTeacherChat] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState({});
  const [chatRoom, setChatRoom] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(false);
  // const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
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

  useEffect(() => {
    let socket;

    if (user?.id) {
      socket = io(`${BACKEND_URL}`, {
        autoConnect: true,
        reconnection: true
      });

      // Unified chat update handler
      const handleNewChat = () => {
        if (user.role === 'teacher') {
          dispatch(fetchMessagesForTeacher());
        } else if (user.role === 'user') {
          dispatch(fetchUnreadCountsForStudent());
        }
      };

      socket.on("newChat", handleNewChat);

      // Cleanup function
      return () => {
        if (socket) {
          socket.off("newChat", handleNewChat);
          socket.disconnect();
        }
      };
    }
  }, [user, dispatch]);;

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


const handleJoinMeeting = (roomName = null) => {
  const userName = user.name;
  const email = user.email;

  let roomId = "";

  // If roomName is provided, it's a teacher meeting room
  if (roomName) {
    // Map the roomName to the teacherChats IDs
    if (roomName === meetingRooms.english) roomId = teacherChats.english.id;
    else if (roomName === meetingRooms.spanish) roomId = teacherChats.spanish.id;
    else if (roomName === meetingRooms.polish) roomId = teacherChats.polish.id;
  } else {
    // If no roomName, it's a group class - use teacher ID logic
    if (user.role === "teacher") {
      roomId = user.id;
    } else if (user.role === "user") {
      roomId = user.teacher.id;
    }
  }

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

        <section className="mt-4 lg:flex pr-2 lg:pl:0 pl-2">
          <div className="lg:w-3/4 mx-4 h-[630px] lg:mb-0 mb-10">
            {events.length > 0 ? (

              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="week"
                step={60}
                timeslots={1}
                onSelectEvent={handleEventClick}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.type === 'group' ? '#4CAF50' : '#673AB7',
                    background: `linear-gradient(135deg, ${event.type === 'group' ? '#4CAF50' : '#9E2FD0'}, ${event.type === 'group' ? '#81C784' : '#A567C2'})`,
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.16)',
                    fontSize: '0.9em',
                    padding: '2px 8px',
                    transition: 'transform 0.2s ease',
                    ':hover': {
                      transform: 'scale(1.02)',
                      zIndex: 100,
                    },
                  },
                })}
                style={{

                  borderRadius: '20px',
                  padding: '20px',
                  background: 'white',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                }}
                formats={{
                  eventTimeRangeFormat: () => "",
                  timeGutterFormat: 'HH:mm',
                }}
                components={{
                  event: CustomEvent,
                  toolbar: CustomToolbar,
                }}
              />
            ) : (
              <div>No events found.</div>
            )}

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

        <div className="flex justify-between mt-4 mx-4">
          <div className="flex justify-between">
            {/* <h2>*Click on an event to join the class directly*</h2> */}
            {/* Teachers Meeting button appears after loading */}
            {!loading &&
              (user.role === "teacher" || user.role === "admin") && (
                <section className="flex justify-end m-3 gap-8">
                  {user.role === "teacher" && (
                    <button
                      className="button-69 "
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

          <div className="flex justify-between items-center">
            <div>
              {(user.role === "teacher" || user.role === "user") && (
                <button
                  onClick={() => handleJoinMeeting()}
                  className="button-69"
                  role="button"
                >
                  Group Class
                </button>
              )}
            </div>
            <div>
              {/* Teachers Meeting button appears after loading */}
              {!loading && (user.role === "teacher" || user.role === "admin") && (
                <section className="flex justify-end m-3 gap-8">
                  {/* Display buttons based on role and language */}
                  {(user.role === "admin" || user.role === "teacher") &&
                    Object.entries(meetingRooms).map(([lang, roomName]) => {
                      const shouldRender =
                        user.role === "admin" ||
                        (user.role === "teacher" &&
                          user.language.includes(lang));
                      if (!shouldRender) return null;

                      return (
                        <button
                          key={lang}
                          onClick={() => handleJoinMeeting(roomName)}
                          className="button-69"
                          role="button"
                        >
                          {roomName}
                        </button>
                      );
                    })}
                </section>
              )}
            </div>
          </div>
        </div>
        <EditEventModal
          isModalOpen={isModalOpen}
          localizer={localizer}
          handleEventClick={handleEventClick}
          handleSelectSlot={handleSelectSlot}
          openModalFrom={openModalFrom}
          handleSubmitEvent={handleSubmitEvent}
          eventDetails={eventDetails}
          handleEventDetailsChange={handleEventDetailsChange}
          setOpenModalFrom={setOpenModalFrom}
          setIsModalOpen={setIsModalOpen}
          setEditingEvent={setEditingEvent}
        />
      </div>
    </div>
  );
};

export default Schedule;
