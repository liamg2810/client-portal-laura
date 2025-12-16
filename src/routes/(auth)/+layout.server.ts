import { requireLogin } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const user = requireLogin();

	if (!user) {
		return redirect(302, '/login');
	}

	return { user };
};
