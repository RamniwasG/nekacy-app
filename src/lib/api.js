const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API request failed' }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

export const eventApi = {
  list: (userId) => request(`/events${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`),
  get: (id) => request(`/events/${id}`),
  create: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/events/${id}`, { method: 'DELETE' }),
  upcoming: (userId) => request(`/events/upcoming${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`),
};

export const attendeeApi = {
  list: (eventId) => request(`/attendees${eventId ? `?eventId=${encodeURIComponent(eventId)}` : ''}`),
  get: (id) => request(`/attendees/${id}`),
  create: (data) => request('/attendees', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/attendees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/attendees/${id}`, { method: 'DELETE' }),
};
