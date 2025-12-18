import * as auth from '$lib/server/auth';
import { Errors } from '$lib/server/constants/Errors';
import { db } from '$lib/server/db';
import { magicLinks } from '$lib/server/db/schema';
import { CreateUser } from '$lib/server/utils/CreateUser';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (locals.user) {
		return redirect(302, '/');
	}

	const [check] = await db
		.select()
		.from(magicLinks)
		.where(and(eq(magicLinks.code, params.magic ?? ''), eq(magicLinks.used, false)));

	if (!check) {
		return { invalidCode: true };
	}

	return {};
};

export const actions: Actions = {
	signup: async (event) => {
		const formData = await event.request.formData();
		const password = formData.get('password');
		const confirmPassword = formData.get('confirm-password');

		if (!password || !confirmPassword) {
			return fail(400, { message: 'Password is required' });
		}

		if (password !== confirmPassword) {
			return fail(400, { message: 'Passwords do not match' });
		}

		const [magic] = await db
			.select()
			.from(magicLinks)
			.where(and(eq(magicLinks.code, event.params.magic ?? ''), eq(magicLinks.used, false)));

		if (!magic || magic.used) {
			return fail(400, { message: 'Invalid magic link' });
		}

		try {
			const uid = await CreateUser(magic.email, password.toString(), 'user');

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, uid);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

			await db.update(magicLinks).set({ used: true }).where(eq(magicLinks.email, magic.email));

			return { success: true };
		} catch (e) {
			const error = e as Error;

			switch (error.message) {
				case Errors.EMAIL_IN_USE:
					return fail(400, 'Account already exists under this email');
				case Errors.INVALID_EMAIL:
					return fail(400, 'Invalid email address');
				case Errors.INVALID_PASSWORD:
					return fail(400, 'Password is invalid. (Min: 6 characters, Max: 255 characters)');
				default:
					return fail(400, 'An unknown error occured');
			}
		}
	}
};
