import { db } from "./index";
import { eq, desc, and, or, gte } from "drizzle-orm";
import { 
    users,
    sessions,
    bookings,
    matches,
    type NewUser,
    type NewSession,
    type NewBooking, 
    type NewMatch
} from "./schema";

// USER QUERIES

export const createUser = async (data: NewUser) => {
    const [user] = await db.insert(users).values(data).returning();
    return user;
}

export const getUserById = async (id: string) => {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
}

export const getUserByEmail = async (email: string) => {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
};

export const getAllUsers = async () => {
    return await db.select().from(users);
};

export const updateUser = async (id: string, data: Partial<NewUser>) => {
    const [updatedUser] = await db
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning();
    return updatedUser;
};

export const upsertUser = async (data: NewUser) => {
    const existingUser = await getUserById(data.id);
    if (existingUser) {
        return await updateUser(data.id, data);
    }
    return await createUser(data);
}

export const deleteUser = async (id: string) => {
    const [deletedUser] = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning();
    return deletedUser;
};

// SESSION QUERIES

export const createSession = async (data: NewSession) => {
    const [session] = await db.insert(sessions).values(data).returning();
    return session;
};

export const getSessionById = async (id: string) => {
    const [session] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, id));
    return session;
};

export const getUpcomingSessions = async () => {
    return await db
        .select()
        .from(sessions)
        .where(
            and(
                gte(sessions.date, new Date().toISOString().split("T")[0]),
                eq(sessions.status, "open")
            )
        )
        .orderBy(desc(sessions.date));
}

export const getAllSessions = async () => {
    return await db.select().from(sessions).orderBy(desc(sessions.date));
};

export const updateSession = async (id: string, data: Partial<NewSession>) => {
    const [updatedSession] = await db
        .update(sessions)
        .set(data)
        .where(eq(sessions.id, id))
        .returning();
    return updatedSession;
};

export const deleteSession = async (id: string) => {
    const [deletedSession] = await db
        .delete(sessions)
        .where(eq(sessions.id, id))
        .returning();
    return deletedSession;
};

// BOOKING QUERIES
export const createBooking = async (data: NewBooking) => {
    const [booking] = await db.insert(bookings).values(data).returning();
    return booking;
};

export const getBookingById = async (id: string) => {
    const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, id));
    return booking;
};

export const getBookingsBySessionId = async (sessionId: string) => {
    return await db
        .select()
        .from(bookings)
        .where(eq(bookings.sessionId, sessionId))
        .orderBy(desc(bookings.createdAt));
};

export const getBookingsByUserId = async (userId: string) => {
    return await db
        .select()
        .from(bookings)
        .where(eq(bookings.userId, userId))
        .orderBy(desc(bookings.createdAt));
};

export const updateBookingPaymentStatus = async (id: string, paymentStatus: string) => {
    const [updatedBooking] = await db
        .update(bookings)
        .set({ paymentStatus })
        .where(eq(bookings.id, id))
        .returning();
    return updatedBooking;
};

export const deleteBooking = async (id: string) => {
    const [deletedBooking] = await db
        .delete(bookings)
        .where(eq(bookings.id, id))
        .returning();
    return deletedBooking;
};

// MATCH QUERIES

export const createMatch = async (data: NewMatch) => {
    const [match] = await db.insert(matches).values(data).returning();
    return match;
};

export const getMatchesBySessionId = async (sessionId: string) => {
    return await db
        .select()
        .from(matches)
        .where(eq(matches.sessionId, sessionId))
        .orderBy(desc(matches.createdAt));
};

export const getMatchesByUserId = async (userId: string) => {
    return await db
        .select()
        .from(matches)
        .where(
            or(
                eq(matches.winnerId, userId),
                eq(matches.loserId, userId)
            )
        )
        .orderBy(desc(matches.createdAt));
};

export const deleteMatch = async (id: string) => {
    const [deletedMatch] = await db
        .delete(matches)
        .where(eq(matches.id, id))
        .returning();
    return deletedMatch;
};