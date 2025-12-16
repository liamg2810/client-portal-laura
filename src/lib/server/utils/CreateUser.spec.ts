import { Errors } from '$lib/server/constants/Errors';
import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import { db } from '../db';
import { user } from '../db/schema';
import { CreateUser } from './CreateUser';

describe('CreateUser.ts', () => {
	const password = 'TestPassword123';

	it('User should be created with correct information', async () => {
		const email = 'createUser@test.com';
		let id = await CreateUser(email, password);

		expect(id).toBeDefined();

		id = id as string;

		const [u] = await db.select().from(user).where(eq(user.id, id));

		expect(u).toBeDefined();

		expect(u.email).toBe(email);
	});

	it('Duplicate users should not be created', async () => {
		const email = 'duplicateUser@test.com';

		try {
			await db.insert(user).values({ id: 'asd', email: email, passwordHash: password });
		} catch {
			// Ignore
		}

		try {
			await CreateUser(email, password);
		} catch (e) {
			const error = e as Error;
			expect(error.message).toBe(Errors.EMAIL_IN_USE);
		}
	});

	it('Short passwords should be rejected', async () => {
		const email = 'password-too-short@test.com';

		try {
			// This should be an accepted password
			const id = await CreateUser(email, 'aaaaaa');
			expect(id).toBeDefined();
		} catch (e) {
			// We dont want to be here so we fail the test
			expect(e).toBeUndefined();
		}

		try {
			// This should be a rejected password
			await CreateUser(email, 'aaaaa');
		} catch (e) {
			const error = e as Error;
			expect(error.message).toBe(Errors.INVALID_PASSWORD);
		}
	});

	it('Long passwords should be rejected', async () => {
		const email = 'password-too-long@test.com';

		try {
			// This password should be accepted
			const id = await CreateUser(email, 'a'.repeat(255));
			expect(id).toBeDefined();
		} catch (e) {
			expect(e).toBeUndefined();
		}

		try {
			// This password should be rejected for being too long
			await CreateUser(email, 'a'.repeat(256));
		} catch (e) {
			const error = e as Error;
			expect(error.message).toBe(Errors.INVALID_PASSWORD);
		}
	});
});
