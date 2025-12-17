import { relations } from 'drizzle-orm';
import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const userRelations = relations(user, ({ many }) => ({
	userRoles: many(userRole)
}));

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const role = sqliteTable('role', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('text').notNull()
});

export const organisation = sqliteTable('organisation', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull()
});

export const organisationUser = sqliteTable('organisationUser', {
	organisation: int('organisation')
		.references(() => organisation.id)
		.notNull(),
	user: text('user')
		.references(() => user.id)
		.notNull()
});

export const userRole = sqliteTable('userRole', {
	user: text('user')
		.references(() => user.id)
		.notNull(),
	role: int('role')
		.references(() => role.id)
		.notNull()
});

export const userRoleRelations = relations(userRole, ({ one }) => ({
	user: one(user, {
		fields: [userRole.user],
		references: [user.id]
	}),
	role: one(role, {
		fields: [userRole.role],
		references: [role.id]
	})
}));

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Role = typeof role.$inferSelect;

export type Organisation = typeof organisation.$inferSelect;

export type OrganisationUser = typeof organisationUser.$inferSelect;

export type UserRole = typeof userRole.$inferSelect;
