import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import dayjs from 'dayjs';
import { updateEvent } from "../redux/userSlice";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const useEventEdit = (studentId) => {
  const dispatch = useDispatch();
  // State to store event details
  const [eventDetails, setEventDetails] = useState({
    start: '',
    end: '',
    eventId: '',
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [openModalFrom, setOpenModalFrom] = useState(false);

  // State to track if we're in editing mode
  const [isEditing, setIsEditing] = useState(false);

  // Function to set event details when an event is clicked from the calendar
  const handleEventEdit = (event) => {
    setEventDetails({
      start: dayjs(event.start).format('HH:mm'), // Format to 24-hour format
      end: dayjs(event.end).format('HH:mm'),
      eventId: event.eventId,
    });
    setIsEditing(true); // Set editing mode to true
  };

  // Function to handle changes in the form fields (start, end time)
  const handleEventDetailsChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectSlot= ({start}) => {
     setSelectedDate(start)
     setOpenModalFrom(true)
  }

  // Function to submit the updated event to the server
  const handleSubmitEvent = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    const timePattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/; // HH:MM format validation
  
    if (!timePattern.test(eventDetails.start) || !timePattern.test(eventDetails.end)) {
      Swal.fire({
        title: "Invalid Time Format",
        text: "Please enter time in HH:MM format (24-hour).",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }
  
    try {
      // Split the start and end times into hours and minutes
      const [startHours, startMinutes] = eventDetails.start.split(":").map(Number);
      const [endHours, endMinutes] = eventDetails.end.split(":").map(Number);
  
      // Combine selectedDate with start and end times, then convert to UTC
      const startDateTimeUTC = dayjs(selectedDate)
        .hour(startHours)
        .minute(startMinutes)
        .second(0)
        .millisecond(0)
        .utc()
        .toDate();
  
      const endDateTimeUTC = dayjs(selectedDate)
        .hour(endHours)
        .minute(endMinutes)
        .second(0)
        .millisecond(0)
        .utc()
        .toDate();
  
      // Send the data to the server
      const response = await fetch(`${BACKEND_URL}/users/modify-schedule`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventDetails.eventId,
          start: startDateTimeUTC,
          end: endDateTimeUTC, 
          newEvent: startDateTimeUTC, 
        }),
      });
  
      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Event updated successfully.",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(async () => {
         try {
           const updatedEvent = await response.json();
           const serializedEvent = {
             ...updatedEvent,
             start: new Date(updatedEvent.start).toISOString(),
             end: new Date(updatedEvent.end).toISOString(),
           };
           dispatch(updateEvent({ studentId, eventId: eventDetails.eventId, updatedEvent: serializedEvent }));
         } catch (error) {
           console.error("Failed to parse JSON, state will not be updated:", error);
         }
        });
        setIsEditing(false);
        setEventDetails({ start: "", end: "", eventId: "" });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Error updating event.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("Error: ", error);
      Swal.fire({
        title: "Error!",
        text: "Error updating event.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };
  

  return {
    eventDetails,
    isEditing,
    selectedDate,
    openModalFrom,
    setOpenModalFrom,
    handleEventEdit, // Trigger this function when an event is clicked
    handleEventDetailsChange, // Handle changes in the form fields
    handleSubmitEvent, // Submit the form and update the event
    setIsEditing, // Optionally, set isEditing to false if needed (e.g., on cancel)
    handleSelectSlot,
  };
};

export default useEventEdit;
