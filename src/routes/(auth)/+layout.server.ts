import { requireLogin } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { userRole } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const user = requireLogin();

	if (!user) {
		return redirect(302, '/login');
	}

	const roles = await db.query.userRole.findMany({
		with: {
			role: true
		},
		where: eq(userRole.user, user.id)
	});

	return { user, roles };
};
