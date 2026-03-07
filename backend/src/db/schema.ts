import { date, integer, pgTable, text, time, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// 1. CORE TABLES
// ==========================================

// USERS TABLE
// Stores member profiles. Synchronized with Clerk Authentication.
export const users = pgTable("users", {
    // 'id' uses text instead of uuid to match external Clerk User IDs.
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

// SESSIONS TABLE
// Stores scheduled badminton events.
export const sessions = pgTable("sessions", {
    id: uuid("id").defaultRandom().primaryKey(),
    date: date("date").notNull(),
    startTime: time("start_time").notNull().default("18:00:00"),
    endTime: time("end_time").notNull().default("21:00:00"),
    location: text("location").notNull().default("GOR Anugerah"),
    // 'field' refers to the specific physical badminton court number/name.
    field: text("field").notNull(),
    price: integer("price").notNull().default(40000),
    maxSlots: integer("max_slots").notNull().default(32),
    // 'status' tracks if the session is open for registration, full, or completed.
    status: text("status").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

// BOOKINGS TABLE (JUNCTION TABLE)
// Resolves the Many-to-Many relationship between Users and Sessions.
// Represents a user's registration for a specific session.
export const bookings = pgTable("bookings", {
    id: uuid("id").defaultRandom().primaryKey(),
    // onDelete: "cascade" ensures if a user is deleted, their bookings are removed.
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    // onDelete: "cascade" ensures if a session is deleted, all its bookings are removed.
    sessionId: uuid("session_id")
        .notNull()
        .references(() => sessions.id, { onDelete: "cascade" }),
    paymentStatus: text("payment_status").notNull().default("unpaid"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

// MATCHES TABLE
// Records 1-on-1 game outcomes within a specific session.
export const matches = pgTable("matches", {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: uuid("session_id")
        .notNull()
        .references(() => sessions.id, { onDelete: "cascade" }),
    winnerId: text("winner_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    loserId: text("loser_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    score: text("score").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

// ==========================================
// 2. RELATIONAL MAPPING FOR DRIZZLE QUERIES
// ==========================================
// These blocks do not create database constraints. 
// They allow Drizzle ORM to perform joins automatically using syntax like .with()

// Maps a user to their multiple bookings and matches.
export const userRelations = relations(users, ({ many }) => ({
    bookings: many(bookings),
    // relationName is required because the matches table references users twice.
    wonMatches: many(matches, { relationName: "userWins" }),
    lostMatches: many(matches, { relationName: "userLosses" }),
}));

// Maps a session to its multiple bookings and matches.
export const sessionRelations = relations(sessions, ({ many }) => ({
    bookings: many(bookings),
    matches: many(matches),
}));

// Maps a specific booking back to its exact one user and one session.
export const bookingRelations = relations(bookings, ({ one }) => ({
    user: one(users, {
        fields: [bookings.userId], // Local foreign key column
        references: [users.id],    // Target primary key column
    }),
    session: one(sessions, {
        fields: [bookings.sessionId],
        references: [sessions.id],
    }),
}));

// Maps a specific match back to its exact session, winning user, and losing user.
export const matchRelations = relations(matches, ({ one }) => ({
    session: one(sessions, {
        fields: [matches.sessionId],
        references: [sessions.id],
    }),
    winner: one(users, {
        fields: [matches.winnerId],
        references: [users.id],
        relationName: "userWins", // Links back to userRelations.wonMatches
    }),
    loser: one(users, {
        fields: [matches.loserId],
        references: [users.id],
        relationName: "userLosses", // Links back to userRelations.lostMatches
    }),
}));

export type User = typeof users.$inferSelect;
export type newUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type newSession = typeof sessions.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type newBooking = typeof bookings.$inferInsert;

export type Match = typeof matches.$inferSelect;
export type newMatch = typeof matches.$inferInsert;