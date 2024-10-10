import { useState, useEffect } from "react";
import Dashboard from "../sections/dashboard";
import Navbar from "../components/navbar";
import { useSelector } from "react-redux";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom"; 
import ChatWindow from "../components/chatWindow";
import MainChat from "../components/buttons/chatList";

const Schedule = () => {
  const user = useSelector((state) => state.user.userInfo.user);
  const header = "MY SCHEDULE";
  const [events, setEvents] = useState([]);
  const [teacherChat, setTeacherChat] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState({});
  const [chatRoom, setChatRoom] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    if (user.role === "teacher") {
      setTeacherChat(user.students);
      setTeacherInfo(user.teacher);
      setChatRoom(user.id);

      if (user.teacherSchedules) {
        const endDate = dayjs().add(3, "year");
  
        const formattedEvents = user.teacherSchedules.flatMap((event) => {
          const startTime = dayjs(`${event.date} ${event.startTime}`, "YYYY-MM-DD HH:mm");
          const endTime = dayjs(`${event.date} ${event.endTime}`, "YYYY-MM-DD HH:mm");
  
          return Array.from({ length: 3 * 52 }, (_, i) => {
            const start = startTime.add(i * 7, "day");
            const end = endTime.add(i * 7, "day");
  
            if (start.isBefore(endDate)) {
              return {
                title: event.studentName, 
                start: start.toDate(),
                end: end.toDate(),
                studentId: event.studentId, 
              };
            }
            return null;
          }).filter(Boolean);
        });
        setEvents(formattedEvents);
      }
    } else if (user.role === "user") {
      setChatRoom(user.id);
  

      if (user.studentSchedules) {
        const endDate = dayjs().add(3, "year");
  
        const formattedEvents = user.studentSchedules.flatMap((event) => {
          const startTime = dayjs(`${event.date} ${event.startTime}`, "YYYY-MM-DD HH:mm");
          const endTime = dayjs(`${event.date} ${event.endTime}`, "YYYY-MM-DD HH:mm");
  
          return Array.from({ length: 3 * 52 }, (_, i) => {
            const start = startTime.add(i * 7, "day");
            const end = endTime.add(i * 7, "day");
  
            if (start.isBefore(endDate)) {
              return {
                title: event.teacherName, 
                start: start.toDate(),
                end: end.toDate(),
                studentId: event.studentId, 
              };
            }
            return null;
          }).filter(Boolean);
        });
        setEvents(formattedEvents);
      }
    }
  }, [user]);

  const localizer = dayjsLocalizer(dayjs);
  
  const CustomEvent = ({ event }) => {
    return (
      <div className="flex items-center justify-center h-full text-[15px]">
        <span>{event.title}</span>
      </div>
    );
  };

  const handleEventClick = (event) => {
    const roomId = event.studentId; 
    const username = user.name;
    navigate(`/call/${username}/${roomId}`);
  };

  return (
    <div className="flex w-full relative h-screen">
      <Dashboard />
      <div className="w-full">
        <section className="w-full custom-bg">
          <div className="container">
            <Navbar header={header} />
          </div>
        </section>

        <section className="mt-4 flex pr-2">
          <div className="w-3/4 mx-4 h-[600px]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView="week"
              min={new Date(2024, 0, 1, 6, 0)}
              max={new Date(2024, 0, 1, 18, 0)}
              step={60}
              timeslots={1}
              components={{
                event: CustomEvent, 
              }}
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
            />
            <h2>
              *Click on an event to join the class directly*
            </h2>
          </div>

          <div className="">
            {user.role === "teacher" ? (
              <MainChat username={user.name} teacherChat={teacherChat} />
            ) : (
              <ChatWindow username={user.name} room={chatRoom} peerInfo={teacherInfo} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Schedule;
