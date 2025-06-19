// src/ContentPostingCalendar.jsx

import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './ContentPostingCalendar.css';
import { useClient } from './ClientContext';
import ClientSelector from './ClientSelector';
import EventRegistry from './EventRegistry';
import NotificationSnackbar from './NotificationSnackbar';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const ContentPostingCalendar = () => {
  const { selectedClient } = useClient();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    platform: 'WordPress',
    clientId: null
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Function to fetch events
  const fetchEvents = async () => {
    try {
      let fetchedEvents;
      if (selectedClient) {
        fetchedEvents = await EventRegistry.getEventsByClient(selectedClient.id);
      } else {
        fetchedEvents = await EventRegistry.getAllEvents();
      }
      setEvents(fetchedEvents.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      })));
    } catch (error) {
      showNotification('Failed to load events', 'error');
    }
  };

  // Fetch events when component mounts or selected client changes
  useEffect(() => {
    fetchEvents();
  }, [selectedClient]);

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleAddEvent = async () => {
    if (newEvent.title && selectedClient) {
      try {
        const eventData = {
          ...newEvent,
          clientId: selectedClient.id
        };
        await EventRegistry.createEvent(eventData);
        await fetchEvents(); // Refresh events after creation
        setNewEvent({
          title: '',
          start: new Date(),
          end: new Date(),
          platform: 'WordPress',
          clientId: selectedClient.id
        });
        showNotification('Event created successfully');
      } catch (error) {
        showNotification('Failed to create event', 'error');
      }
    } else if (!selectedClient) {
      showNotification('Please select a client before adding an event', 'warning');
    }
  };

  const handleEventDrop = async ({ event, start, end }) => {
    try {
      await EventRegistry.updateEvent(event.id, {
        ...event,
        start,
        end
      });
      await fetchEvents(); // Refresh events after update
      showNotification('Event updated successfully');
    } catch (error) {
      showNotification('Failed to update event', 'error');
      await fetchEvents(); // Refresh to revert changes if update failed
    }
  };

  const handleEventDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await EventRegistry.deleteEvent(eventId);
        await fetchEvents(); // Refresh events after deletion
        showNotification('Event deleted successfully');
      } catch (error) {
        showNotification('Failed to delete event', 'error');
      }
    }
  };

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: '#3174ad',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };

    // Different colors for different platforms
    switch (event.platform) {
      case 'WordPress':
        style.backgroundColor = '#21759b';
        break;
      case 'Medium':
        style.backgroundColor = '#00ab6c';
        break;
      case 'LinkedIn':
        style.backgroundColor = '#0077b5';
        break;
      case 'Twitter':
        style.backgroundColor = '#1da1f2';
        break;
      default:
        break;
    }

    return {
      style
    };
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Content Posting Calendar</h2>
        
        {/* Client Selector */}
        <div className="client-selector-container">
          <ClientSelector />
        </div>

        <div className="event-form">
          <input
            type="text"
            placeholder="Add Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            disabled={!selectedClient}
          />
          <input
            type="datetime-local"
            value={format(newEvent.start, "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => setNewEvent({ 
              ...newEvent, 
              start: new Date(e.target.value),
              end: new Date(e.target.value)
            })}
            disabled={!selectedClient}
          />
          <select
            value={newEvent.platform}
            onChange={(e) => setNewEvent({ ...newEvent, platform: e.target.value })}
            disabled={!selectedClient}
          >
            <option value="WordPress">WordPress</option>
            <option value="Medium">Medium</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Twitter">Twitter</option>
          </select>
          <button 
            onClick={handleAddEvent}
            disabled={!selectedClient}
          >
            Add Event
          </button>
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day']}
        defaultView="month"
        onEventDrop={handleEventDrop}
        draggableAccessor={() => true}
        resizable
        selectable
        onSelectEvent={(event) => {
          if (window.confirm('Do you want to delete this event?')) {
            handleEventDelete(event.id);
          }
        }}
      />

      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
        sx={{
          '& .MuiAlert-message': {
            color: 'black',
          },
          '& .MuiAlert-standardSuccess': {
            color: 'black',
          },
          '& .MuiAlert-standardError': {
            color: 'black',
          }
        }}
      />
    </div>
  );
};

export default ContentPostingCalendar;
