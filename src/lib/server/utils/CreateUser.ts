import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { HASH_SETTINGS } from '../constants/Auth';
import { db } from '../db';
import { user } from '../db/schema';

export async function CreateUser(email: string, password: string) {
	const userId = generateUserId();
	const passwordHash = await hash(password, HASH_SETTINGS);

	await db.insert(user).values({ id: userId, email, passwordHash });

	return userId;
}

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}
