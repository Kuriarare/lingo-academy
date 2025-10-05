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
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import CustomToolbar from "../customToolBar";
import {
  fetchMessagesForTeacher,
  fetchUnreadCountsForStudent,
} from "../../redux/chatSlice";
import { io } from "socket.io-client";
import { meetingRooms, teacherChats } from "../../constants";
import EditEventModal from "./EditEventModal";
import Dropdown from "./Dropdown";
import TeacherPanel from "./TeacherPanel";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Schedule = () => {
  const user = useSelector((state) => state.user.userInfo.user);
  const header = user.role === "admin" ? "MEETINGS" : "MY SCHEDULE";
  const isChatVisible =
    (user.role === "teacher" && user.students && user.students.length > 0) ||
    (user.role === "user" && user.teacher);
  const [teacherChat, setTeacherChat] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState({});
  const [chatRoom, setChatRoom] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(false);
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

    if (events !== undefined) {
      setLoading(false);
    }
  }, [user, events]);

  useEffect(() => {
    let socket;

    if (user?.id) {
      socket = io(`${BACKEND_URL}`, {
        autoConnect: true,
        reconnection: true
      });

      const handleNewChat = () => {
        if (user.role === 'teacher') {
          dispatch(fetchMessagesForTeacher());
        } else if (user.role === 'user') {
          dispatch(fetchUnreadCountsForStudent());
        }
      };

      socket.on("newChat", handleNewChat);

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
    <div className="flex items-center justify-center text-center h-full text-[10px] sm:text-[13px] flex-wrap">
      <span>{event.title}</span>
    </div>
  );

  const handleEventClick = (event) => {
    if (editingEvent) {
      handleEventEdit(event);
      setIsModalOpen(true);
    } else {
      const roomId = event.studentId;
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

    if (roomName) {
      if (roomName === meetingRooms.english) roomId = teacherChats.english.id;
      else if (roomName === meetingRooms.spanish) roomId = teacherChats.spanish.id;
      else if (roomName === meetingRooms.polish) roomId = teacherChats.polish.id;
    } else {
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
    <div className="flex w-full relative min-h-screen bg-gray-100 dark:bg-brand-dark">
      <Dashboard />
      <div className="w-full">
        <section className="w-full bg-brand-navbar-light dark:bg-brand-dark-secondary shadow-md border-b border-transparent dark:border-purple-500/20">
          <div className="container">
            <Navbar header={header} />
          </div>
        </section>

        <section
          className={`mt-4 flex flex-col xl:flex-row gap-4 px-4 ${
            !isChatVisible && user.role !== "admin" ? "justify-center" : ""
          }`}
        >
          {user.role === "admin" ? (
            <div className="w-full flex justify-center items-center h-[630px]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <button
                  onClick={() => handleJoinMeeting(meetingRooms.english)}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:scale-105 transition-transform"
                >
                  Join English Room
                </button>
                <button
                  onClick={() => handleJoinMeeting(meetingRooms.spanish)}
                  className="bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:scale-105 transition-transform"
                >
                  Join Spanish Room
                </button>
                <button
                  onClick={() => handleJoinMeeting(meetingRooms.polish)}
                  className="bg-gradient-to-r from-red-500 to-red-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:scale-105 transition-transform"
                >
                  Join Polish Room
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="lg:flex-grow h-[630px]">
                {events.length > 0 ? (
                  <PerfectScrollbar
                    className={
                      user?.settings?.darkMode ? "dark-scrollbar" : ""
                    }
                  >
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
                        },
                      })}
                      style={{
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
                  </PerfectScrollbar>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        {user.role === "teacher"
                          ? "You have no students assigned at the moment."
                          : "You have no teacher assigned."}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        {user.role === "teacher"
                          ? "Please contact an administrator to get students assigned to you."
                          : "Please contact an administrator to get a teacher assigned to you."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {isChatVisible && (
                <div className="w-full xl:w-[350px] flex-shrink-0">
                  {user.role === "teacher" ? (
                    <MainChat
                      user={user}
                      username={user.name}
                      teacherChat={teacherChat}
                      email={user.email}
                      handleJoinMeeting={handleJoinMeeting}
                      setEditingEvent={setEditingEvent}
                      editingEvent={editingEvent}
                      loading={loading}
                    />
                  ) : (
                    <ChatWindow
                      username={user.name}
                      room={chatRoom}
                      email={user.email}
                      peerInfo={user.teacher}
                      handleJoinMeeting={handleJoinMeeting}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </section>
        {user.role === "teacher" &&
          user.students &&
          user.students.length > 0 && (
            <section className="px-4">
              <TeacherPanel
                students={user.students}
                events={events}
                teacherId={user.id}
                teacherName={`${user.name} ${user.lastName}`}
              />
            </section>
          )}
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
