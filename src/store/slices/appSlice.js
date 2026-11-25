import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  attendees: [],
  selectedEvent: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addEvent(state, action) {
      state.events.push(action.payload);
    },
    addAttendee(state, action) {
      state.attendees.push(action.payload);
    },
    setSelectedEvent(state, action) {
      state.selectedEvent = action.payload;
    },
    clearSelectedEvent(state) {
      state.selectedEvent = null;
    },
    updateAttendee(state, action) {
      const index = state.attendees.findIndex((attendee) => attendee.id === action.payload.id);
      if (index !== -1) state.attendees[index] = action.payload;
    },
    updateEvent(state, action) {
      const index = state.events.findIndex((event) => event.id === action.payload.id);
      if (index !== -1) state.events[index] = action.payload;
    },
    deleteEvent(state, action) {
      state.events = state.events.filter((event) => event.id !== action.payload);
      state.attendees = state.attendees.filter((attendee) => attendee.eventId !== action.payload);
      if (state.selectedEvent?.id === action.payload) state.selectedEvent = null;
    },
    setEvents(state, action) {
      state.events = action.payload;
    },
    setAttendees(state, action) {
      state.attendees = action.payload;
    },
  },
});

export const { setEvents, setAttendees, addEvent, updateEvent, deleteEvent, addAttendee, setSelectedEvent, clearSelectedEvent, updateAttendee } = appSlice.actions;
export default appSlice.reducer;
