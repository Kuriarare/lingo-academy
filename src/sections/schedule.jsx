import { useState, useEffect } from "react";
import Dashboard from "../sections/dashboard";
import Navbar from "../components/navbar";
import { useSelector } from "react-redux";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import JoinClassButton from "../components/buttons/joinClass";
import ChatWindow from "../components/chatWindow";
import MainChat from "../components/buttons/chatList";

const Schedule = () => {
  const user = useSelector((state) => state.user.userInfo.user);
  const header = "MY SCHEDULE";
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [chatRoom, setChatRoom] = useState("");

  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [events, setEvents] = useState([]);
  const [teacherChat, setTeacherChat] = useState([]);
  const [teacherInfo , setTeacherInfo] = useState({});


  useEffect(() => {
    if (user.role === "teacher") {
      setUsername(user.name);
      setRoom(user._id);
      setTeacherChat(user.students);
      if (!user.students || user.students.length === 0) {
        setIsButtonVisible(false);
      }
    } else {
      setUsername(user.name);
      setRoom(user.teacher._id);
      setChatRoom(user._id);
      setTeacherInfo(user.teacher);
      if (!user.teacher) {
        setIsButtonVisible(false);
      }
    }

    // Map user.schedule to the events array for Calendar
    if (user.schedule) {
      const endDate = dayjs().add(3, "year"); // Define the end date as 3 years from now

      const formattedEvents = user.schedule.flatMap((event) => {
        const startTime = dayjs(
          `${event.date} ${event.startTime}`,
          "YYYY-MM-DD HH:mm"
        );
        const endTime = dayjs(
          `${event.date} ${event.endTime}`,
          "YYYY-MM-DD HH:mm"
        );

        // Generate events for the next 3 years
        return Array.from({ length: 3 * 52 }, (_, i) => {
          // 3 years * 52 weeks
          const start = startTime.add(i * 7, "day");
          const end = endTime.add(i * 7, "day");

          // Check if the event is within the 3-year range
          if (start.isBefore(endDate)) {
            return {
              title:
                user.role === "teacher" ? event.studentName : event.teacherName,
              start: start.toDate(),
              end: end.toDate(),
            };
          }
          return null;
        }).filter(Boolean); // Filter out null values
      });
      setEvents(formattedEvents);
    }
  }, [user]);

  const localizer = dayjsLocalizer(dayjs);

  return (
    <div className="flex w-full relative h-screen">
      <Dashboard />
      <div className="w-full">
        <section className="w-full custom-bg">
          <div className="container">
            <Navbar header={header} />
          </div>
        </section>

       
        <section className="mt-4 flex">
          <div className="w-3/4 mx-4 h-[600px]">
            <Calendar
              localizer={localizer}
              events={events} // Pass the mapped events here
              startAccessor="start"
              endAccessor="end"
              defaultView="week"
              min={new Date(2024, 0, 1, 6, 0)} 
              max={new Date(2024, 0, 1, 18, 0)} 
              step={60} 
              timeslots={1} 
              formats={{
                timeGutterFormat: "HH:mm", 
                eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                  `${localizer.format(
                    start,
                    "HH:mm",
                    culture
                  )} - ${localizer.format(end, "HH:mm", culture)}`,
              }}
            />
               <div className="my-1 flex justify-end">
              <JoinClassButton
                username={username}
                room={room}
                isButtonVisible={isButtonVisible}
                setUsername={setUsername}
                setRoom={setRoom}
              />
            </div>
          </div>
          <div className="">
         
            <div className="w-full">
             
              {user.role === "teacher" ? (
                <MainChat username={username} teacherChat ={teacherChat}  />
              ) : (
                <ChatWindow username={username} room={chatRoom} peerInfo={teacherInfo} />
              )}

            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Schedule;
