import { useState } from 'react';
import dayjs from 'dayjs';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const useEventEdit = () => {
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
      alert("Please enter time in HH:MM format (24-hour)");
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
        alert("Event updated successfully");
        setIsEditing(false); 
        setEventDetails({ start: "", end: "", eventId: "" }); 
      } else {
        alert("Error updating event");
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("Error updating event");
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
