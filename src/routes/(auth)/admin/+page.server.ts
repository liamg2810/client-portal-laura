import { Roles } from '$lib/server/constants/Auth';
import { db } from '$lib/server/db';
import { user as u, userRole } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	const userRoles = await db.query.userRole.findMany({
		where: eq(userRole.user, user.id),
		with: {
			role: true
		}
	});

	const isAdmin = userRoles.some((u) => u.role.name === Roles.ADMIN);

	if (!isAdmin) {
		return redirect(302, '/');
	}

	const users = await db.select({ id: u.id, email: u.email }).from(u);

	return { users };
};
