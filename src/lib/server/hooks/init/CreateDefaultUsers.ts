import { ADMIN_EMAIL } from '$env/static/private';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { CreateUser } from '$lib/server/utils/CreateUser';
import { eq } from 'drizzle-orm';

const insecure = '!Admin123';

export async function CreateUsers() {
	const exists = await db.select().from(user).where(eq(user.email, ADMIN_EMAIL));

	console.log(exists.length);

	if (exists.length > 0) return;

	await CreateUser(ADMIN_EMAIL, insecure);
}
