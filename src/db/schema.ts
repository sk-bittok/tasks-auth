import {
	boolean,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const usersTable = pgTable("users", {
	id: serial().primaryKey().notNull(),
	pid: uuid().defaultRandom().notNull(),
	username: text().unique().notNull(),
	email: text().unique().notNull(),
	password: text().notNull(),
	resetToken: text("reset_token"),
	resetTokenSentAt: timestamp("reset_token_sent_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export const InsertUserSchema = createInsertSchema(usersTable, {
	username: (schema) => schema.min(5).max(48),
	email: (schema) => schema.email(),
	password: (schema) => schema.min(8).max(48),
}).omit({
	id: true,
	pid: true,
	createdAt: true,
	updatedAt: true,
	resetToken: true,
	resetTokenSentAt: true,
});
export const SelectUserSchema = createSelectSchema(usersTable);
export const UpdateUserSchema = InsertUserSchema.partial();

export const tasksTable = pgTable("tasks", {
	id: serial().primaryKey().notNull(),
	pid: uuid().defaultRandom().notNull(),
	userId: integer("user_id").references(() => usersTable.id).notNull(),
	title: text().notNull(),
	done: boolean().notNull().default(false),
	description: text(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() =>
		new Date()
	),
});

export const SelectTaskSchema = createSelectSchema(tasksTable);
export const InsertTaskSchema = createInsertSchema(tasksTable, {
	title: (schema) => schema.min(5).max(32),
	description: (schema) => schema.max(256),
}).omit({
	id: true,
	pid: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
});
export const UpdateTaskSchema = InsertTaskSchema.partial();
