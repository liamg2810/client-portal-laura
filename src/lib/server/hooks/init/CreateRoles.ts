import { Roles } from '$lib/server/constants/Auth';
import { db } from '$lib/server/db';
import { role } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function CreateRoles() {
	Object.values(Roles).forEach(async (Role) => {
		const [r] = await db.select().from(role).where(eq(role.name, Role));

		if (r) {
			return;
		}

		await db.insert(role).values({ name: Role });
	});
}
