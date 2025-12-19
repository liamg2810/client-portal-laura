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

export const organistaionRelations = relations(organisation, ({ many }) => ({
	organistationUsers: many(organisationUser)
}));

export const organisationUser = sqliteTable('organisationUser', {
	organisation: int('organisation')
		.references(() => organisation.id)
		.notNull(),
	user: text('user')
		.references(() => user.id)
		.notNull()
});

export const organistationUserRelations = relations(organisationUser, ({ one }) => ({
	user: one(user, {
		fields: [organisationUser.user],
		references: [user.id]
	}),
	organisation: one(organisation, {
		fields: [organisationUser.organisation],
		references: [organisation.id]
	})
}));

export const message = sqliteTable('message', {
	id: int('id').primaryKey({ autoIncrement: true }),
	organisation: int('organisation')
		.references(() => organisation.id)
		.notNull(),
	user: text('user')
		.references(() => user.id)
		.notNull(),
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const messageRelations = relations(message, ({ one }) => ({
	user: one(user, { fields: [message.user], references: [user.id] }),
	organisation: one(organisation, { fields: [message.organisation], references: [organisation.id] })
}));

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

export const magicLinks = sqliteTable('magicLinks', {
	id: int('id').primaryKey({ autoIncrement: true }),
	code: text('code').unique().notNull(),
	expires: integer('expires', { mode: 'timestamp_ms' }),
	used: integer('used', { mode: 'boolean' }).default(false),
	email: text('email').notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Role = typeof role.$inferSelect;

export type Organisation = typeof organisation.$inferSelect;

export type OrganisationUser = typeof organisationUser.$inferSelect;

export type Message = typeof message.$inferSelect;

export type UserRole = typeof userRole.$inferSelect;

export type MagicLinks = typeof magicLinks.$inferSelect;
