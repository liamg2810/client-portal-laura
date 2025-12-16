import * as auth from '$lib/server/auth';
import { CreateUsers } from '$lib/server/hooks/init/CreateDefaultUsers';
import { CreateRoles } from '$lib/server/hooks/init/CreateRoles';
import type { Handle, ServerInit } from '@sveltejs/kit';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;

		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);

	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle: Handle = handleAuth;

export const init: ServerInit = async () => {
	await CreateRoles();
	await CreateUsers();
};
