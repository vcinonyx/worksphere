import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import AddEventModal from "./AddEventModal";
import moment from "moment";
import ReactToolTip from "react-tooltip";
import ShowEventPopup from "./ShowEventPopup";

const Calendar = () => {
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);

      try {
        const response = await axios.get(`api/events/user/${userData.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const formattedEvents = response.data.map((event) => ({
          id: event.id,
          title: event.eventTitle,
          description: event.eventDescription,
          start: moment(event.eventStartDate).format("YYYY-MM-DD HH:mm:ss"),
          end: moment(event.eventEndDate).format("YYYY-MM-DD HH:mm:ss"),
          color: "#007bff",
          textColor: "white",
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchUserAndEvents();
  }, []);

  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description,
      start: info.event.start,
      end: info.event.end,
    });
    setShowEventModal(true);
  };

  const handleEventPositioned = (info) => {
    info.el.setAttribute(
        "title",
        info.event.extendedProps.description || "No description"
    );
    ReactToolTip.rebuild();
  };

  return (
      <>
        <FullCalendar
            defaultView="dayGridMonth"
            plugins={[dayGridPlugin, interactionPlugin]}
            eventClick={handleEventClick}
            dateClick={() => setShowAddModal(true)}
            events={events}
            eventPositioned={handleEventPositioned}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: false,
              hour12: false,
            }}
            customButtons={{
              button: {
                text: "Add Event",
                click: () => setShowAddModal(true),
              },
            }}
            header={{
              left: "prev,next today button",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
        />
        <AddEventModal show={showAddModal} onHide={() => setShowAddModal(false)} />
        {showEventModal && (
            <ShowEventPopup
                show={true}
                onHide={() => setShowEventModal(false)}
                data={selectedEvent}
            />
        )}
      </>
  );
};

export default Calendar;
