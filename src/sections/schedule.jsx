import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import Dashboard from "../sections/dashboard";
import Navbar from "../components/navbar";
import ChatWindow from "../components/chatWindow";
import MainChat from "../components/buttons/chatList";
import useFormattedEvents from "../hooks/useFormattedEvents";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const engRoom = 'English Teachers Meeting';
const spaRoom = 'Spanish Teachers Meeting';
const polRoom = 'Polish Teachers Meeting';

const teacherChats = {
  english: { id: "uuid-teacher-english", name: "Teachers Chat - English", type: "teacher" },
  spanish: { id: "uuid-teacher-spanish", name: "Teachers Chat - Spanish", type: "teacher" },
  polish: { id: "uuid-teacher-polish", name: "Teachers Chat - Polish", type: "teacher" },
};


const Schedule = () => {
  const user = useSelector((state) => state.user.userInfo.user);
  console.log("User:", user);
  const header = "MY SCHEDULE";
  const [teacherChat, setTeacherChat] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState({});
  const [chatRoom, setChatRoom] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();




  const events = useFormattedEvents(user);

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
    const roomId = event.studentId;
    const userName = user.name;
    const email = user.email;
    navigate("/classroom", { state: { roomId, userName, email, fromMeeting: false } });
  };

  const handleJoinMeeting = (roomName) => {
    const userName = user.name;
    const email = user.email;
    
    // Map the roomName to the teacherChats IDs
    let roomId = "";
    if (roomName === engRoom) roomId = teacherChats.english.id;
    if (roomName === spaRoom) roomId = teacherChats.spanish.id;
    if (roomName === polRoom) roomId = teacherChats.polish.id;
  
    navigate("/classroom", { state: { roomId, userName, email, fromMeeting: true } });
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
                  step={60}  // Step size of 60 minutes
                  timeslots={1}  // Show each minute slot
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
              <h2>*Click on an event to join the class directly*</h2>
            </div>
  
            <div >
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
      </div>
    </div>
  );
  
};

export default Schedule;
