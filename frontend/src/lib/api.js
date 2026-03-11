import api from "./axios";

// ==========================================
// USERS API
// ==========================================

export const syncUser = async (userData) => {
    const { data } = await api.post("/users/sync", userData);
    return data;
};

// NEW: Fetch current authenticated user profile
export const getCurrentUser = async () => {
    const { data } = await api.get("/users/me");
    return data;
};

// NEW: Fetch all users (for admin dropdowns/leaderboards)
export const getAllUsers = async () => {
    const { data } = await api.get("/users");
    return data;
};

// ==========================================
// SESSIONS API
// ==========================================

export const getAllSessions = async () => {
    const { data } = await api.get("/sessions");
    return data;
};

// NEW: Fetch only upcoming sessions (for the homepage)
export const getUpcomingSessions = async () => {
    const { data } = await api.get("/sessions/upcoming");
    return data;
};

export const getSessionById = async (id) => {
    const { data } = await api.get(`/sessions/${id}`);
    return data;
};

export const createSession = async (sessionData) => {
    const { data } = await api.post("/sessions", sessionData);
    return data;
};


export const updateSession = async ({ id, ...sessionData }) => {
    const { data } = await api.patch(`/sessions/${id}`, sessionData);
    return data;
};

export const deleteSession = async (id) => {
    const { data } = await api.delete(`/sessions/${id}`);
    return data;
};

// ==========================================
// BOOKINGS API
// ==========================================

export const createBooking = async (bookingData) => {
    const { data } = await api.post("/bookings", bookingData);
    return data;
};

export const getBookingsBySessionId = async (sessionId) => {
    const { data } = await api.get(`/bookings/session/${sessionId}`);
    return data;
};

export const getMyBookings = async () => {
    const { data } = await api.get("/bookings/me");
    return data;
};

export const getBookingById = async (id) => {
    const { data } = await api.get(`/bookings/${id}`);
    return data;
};

export const updateBookingPaymentStatus = async (id, paymentStatus) => {
    const { data } = await api.patch(`/bookings/${id}/payment`, { paymentStatus });
    return data;
};

export const deleteBooking = async (id) => {
    const { data } = await api.delete(`/bookings/${id}`);
    return data;
};

// ==========================================
// MATCHES API
// ==========================================

export const createMatch = async (matchData) => {
    const { data } = await api.post("/matches", matchData);
    return data;
};

export const getMatchesBySessionId = async (sessionId) => {
    const { data } = await api.get(`/matches/session/${sessionId}`);
    return data;
};

export const getMyMatches = async () => {
    const { data } = await api.get("/matches/me");
    return data;
};

export const deleteMatch = async (id) => {
    const { data } = await api.delete(`/matches/${id}`);
    return data;
};