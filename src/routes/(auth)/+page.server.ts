import * as auth from '$lib/server/auth';
import { Roles } from '$lib/server/constants/Auth';
import { db } from '$lib/server/db';
import { organisation, organisationUser, userRole } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	const userRoles = await db.query.userRole.findMany({
		where: eq(userRole.user, user.id),
		with: {
			role: true
		}
	});

	let orgs;

	if (userRoles.some((r) => r.role.name === Roles.ADMIN)) {
		orgs = await db.select().from(organisation);
	} else {
		orgs = (
			await db.query.organisationUser.findMany({
				where: eq(organisationUser.user, user.id),
				with: {
					organisation: true
				}
			})
		).map((o) => o.organisation);
	}

	return { orgs };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/login');
	}
};
