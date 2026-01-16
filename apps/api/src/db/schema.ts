import { integer, pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull().unique(),
    picture: varchar("picture"),
    createdAt: timestamp("created_at").defaultNow(),
});


export const workspaces = pgTable("Workspaces", {
    id: serial("id").primaryKey(),
    messages: varchar("messages").notNull(),
    fileData: varchar("fileData"),
    user: varchar("user").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
})