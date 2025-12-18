import * as auth from '$lib/server/auth';
import { Roles } from '$lib/server/constants/Auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { validateEmail } from '$lib/server/utils/CreateUser';
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

		if (!validateEmail(email)) {
			return fail(400, {
				message: 'Invalid email'
			});
		}

		const [check] = await db.select().from(table.user).where(eq(table.user.email, email));

		if (check !== undefined) {
			return fail(400, {
				message: 'Email already in use.'
			});
		}

		await db.update(table.magicLinks).set({ used: true }).where(eq(table.magicLinks.email, email));

		const linkCode = auth.generateSessionToken();

		try {
			await db
				.insert(table.magicLinks)
				.values({ code: linkCode, expires: new Date(Date.now() + 3_600_000), email });

			return { code: linkCode };
		} catch {
			return fail(400, { message: 'An unknown error occured' });
		}
	}
};
