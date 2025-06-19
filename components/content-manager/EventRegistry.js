import { API_BASE_URL, createFetchOptions } from '../config';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

const api = {
  async createEvent(eventData) {
    const options = createFetchOptions('POST', eventData);
    const response = await fetch(`${API_BASE_URL}/events`, options);
    const data = await handleResponse(response);
    return data.event;
  },

  async updateEvent(eventId, eventData) {
    const options = createFetchOptions('PUT', eventData);
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, options);
    const data = await handleResponse(response);
    return data.event;
  },

  async deleteEvent(eventId) {
    const options = createFetchOptions('DELETE');
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, options);
    return handleResponse(response);
  },

  async getAllEvents() {
    const options = createFetchOptions('GET');
    const response = await fetch(`${API_BASE_URL}/events`, options);
    const data = await handleResponse(response);
    return data.events || [];
  },

  async getEventsByClient(clientId) {
    const options = createFetchOptions('GET');
    const response = await fetch(`${API_BASE_URL}/events/client/${clientId}`, options);
    const data = await handleResponse(response);
    return data.events || [];
  }
};

export default api;