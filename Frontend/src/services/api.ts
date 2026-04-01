// @ts-ignore
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Créer une instance axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ===== AUTH =====
export const authAPI = {
    register: (username: string, email: string, password: string, consentGiven: boolean) =>
        api.post('/auth/register', { username, email, password, consentGiven }),

    login: (username: string, password: string) =>
        api.post('/auth/login', { username, password }),
};

// ===== USERS =====
export const userAPI = {
    getProfile: () => api.get('/users/me'),
    updateProfile: (data: any) => api.put('/users/me', data),
    getUserById: (id: string) => api.get(`/users/${id}`),
    searchUsers: (query: string) => api.get(`/users/search?q=${query}`),
    deleteAccount: () => api.delete('/users/me'),
    exportUserData: () => api.get('/users/me/export'),
};

// ===== FRIENDS =====
export const friendAPI = {
    getFriends: () => api.get('/friends'),
    getPendingRequests: () => api.get('/friends/pending'),
    sendRequest: (recipientId: string) => api.post('/friends/request', { recipientId }),
    respondToRequest: (friendshipId: string, action: 'accepted' | 'rejected') =>
        api.put(`/friends/respond/${friendshipId}`, { action }),
    removeFriend: (friendshipId: string) => api.delete(`/friends/${friendshipId}`),
};

// ===== EVENTS =====
export const eventAPI = {
    getEvents: () => api.get('/events'),
    getEventById: (id: string) => api.get(`/events/${id}`),
    createEvent: (data: any) => api.post('/events', data),
    updateEvent: (id: string, data: any) => api.put(`/events/${id}`, data),
    deleteEvent: (id: string) => api.delete(`/events/${id}`),
    inviteUsers: (eventId: string, userIds: string[]) =>
        api.post(`/events/${eventId}/invite`, { userIds }),
    getPendingInvitations: () => api.get('/events/invitations/pending'),
    respondToInvitation: (invitationId: string, action: 'accepted' | 'declined') =>
        api.put(`/events/invitations/${invitationId}/respond`, { action }),
    leaveEvent: (eventId: string) => api.delete(`/events/${eventId}/leave`),
    removeParticipant: (eventId: string, participantId: string) =>
        api.delete(`/events/${eventId}/participants/${participantId}`),
};

// ===== AVAILABILITIES =====
export const availabilityAPI = {
    submitAvailability: (eventId: string, availableDates: string[]) =>
        api.post('/availabilities', { eventId, availableDates }),
    getEventAvailabilities: (eventId: string) =>
        api.get(`/availabilities/event/${eventId}`),
    getMyAvailability: (eventId: string) =>
        api.get(`/availabilities/event/${eventId}/my`),
    calculateBestDate: (eventId: string) =>
        api.post(`/availabilities/event/${eventId}/calculate`),
};

export default api;