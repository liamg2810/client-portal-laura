import { ADMIN_EMAIL } from '$env/static/private';
import { Roles } from '$lib/server/constants/Auth';
import { db } from '$lib/server/db';
import { role, userRole } from '$lib/server/db/schema';
import { CreateUser } from '$lib/server/utils/CreateUser';
import { eq } from 'drizzle-orm';

const insecure = '!Admin123';

export async function CreateUsers() {
	let id: string;

	try {
		id = await CreateUser(ADMIN_EMAIL, insecure, Roles.ADMIN);
	} catch {
		return;
	}

	if (id === undefined) {
		return;
	}

	const [r] = await db.select().from(role).where(eq(role.name, Roles.ADMIN));

	if (!r) {
		console.error('Failed to find admin role.');
		return;
	}

	await db.insert(userRole).values({ user: id, role: r.id });
}
