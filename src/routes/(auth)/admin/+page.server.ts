import { Roles } from '$lib/server/constants/Auth';
import { Errors } from '$lib/server/constants/Errors';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { CreateUser, validateEmail, validatePassword } from '$lib/server/utils/CreateUser';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	const userRoles = await db.query.userRole.findMany({
		where: eq(table.userRole.user, user.id),
		with: {
			role: true
		}
	});

	const isAdmin = userRoles.some((u) => u.role.name === Roles.ADMIN);

	if (!isAdmin) {
		return redirect(302, '/');
	}

	const users = await db.query.userRole.findMany({
		with: { user: { columns: { id: true, email: true } }, role: true }
	});

	// const users = await db.select({ id: u.id, email: u.email, role: }).from(u);

	return { users };
};

export const actions: Actions = {
	createUser: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (!validateEmail(email)) {
			return fail(400, {
				message: 'Invalid email'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
		}

		try {
			await CreateUser(email, password, 'user');
		} catch (e) {
			const error = e as Error;

			switch (error.message) {
				case Errors.EMAIL_IN_USE:
					return fail(400, { message: 'Email is already in use.' });
				case Errors.INVALID_EMAIL:
					return fail(400, { message: 'Email is invalid' });
				case Errors.INVALID_PASSWORD:
					return fail(400, { message: 'Password is invalid' });
				default:
					return fail(400, { message: 'An unknown error occured' });
			}
		}
	}
};
