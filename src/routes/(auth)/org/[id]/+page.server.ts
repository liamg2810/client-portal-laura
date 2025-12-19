import { Roles } from '$lib/server/constants/Auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const orgId = Number(params.id);
	const { user } = await parent();

	// check admin
	const userRoles = await db.query.userRole.findMany({
		where: eq(table.userRole.user, user.id),
		with: { role: true }
	});

	const isAdmin = userRoles.some((r) => r.role.name === Roles.ADMIN);

	// if not admin, check membership
	if (!isAdmin) {
		const [membership] = await db
			.select()
			.from(table.organisationUser)
			.where(
				and(
					eq(table.organisationUser.user, user.id),
					eq(table.organisationUser.organisation, orgId)
				)
			);

		if (!membership) {
			throw redirect(302, '/');
		}
	}

	const [org] = await db.select().from(table.organisation).where(eq(table.organisation.id, orgId));

	const messages = await db.query.message.findMany({
		where: eq(table.message.organisation, orgId),
		with: { user: { columns: { id: true, email: true } } }
	});

	messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

	return { org, messages };
};

export const actions: Actions = {
	postMessage: async (event) => {
		const form = await event.request.formData();
		const orgId = Number(form.get('organisation'));
		const content = String(form.get('content') || '').trim();

		if (!content) {
			return fail(400, { message: 'Message content required' });
		}

		const userId =
			event.locals.user?.id ?? event.locals.session?.userId ?? event.locals.session?.id;

		if (!userId) {
			return fail(401, { message: 'Not authenticated' });
		}

		try {
			await db
				.insert(table.message)
				.values({ organisation: orgId, user: userId, content, createdAt: new Date() });
			return { success: true };
		} catch {
			return fail(500, { message: 'Failed to post message' });
		}
	}
};
