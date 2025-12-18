import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import { HASH_SETTINGS } from '../constants/Auth';
import { Errors } from '../constants/Errors';
import { EMAIL_REGEX } from '../constants/Regex';
import { db } from '../db';
import { role, user, userRole } from '../db/schema';

export async function CreateUser(email: string, password: string, r: string) {
	if (!validateEmail(email)) {
		throw new Error(Errors.INVALID_EMAIL);
	}

	if (!validatePassword(password)) {
		throw new Error(Errors.INVALID_PASSWORD);
	}

	const [ro] = await db.select().from(role).where(eq(role.name, r));

	if (!ro) {
		throw new Error();
	}

	const userId = generateUserId();
	const passwordHash = await hash(password, HASH_SETTINGS);

	try {
		await db.insert(user).values({ id: userId, email, passwordHash });
	} catch {
		throw new Error(Errors.EMAIL_IN_USE);
	}

	await db.insert(userRole).values({ user: userId, role: ro.id });

	return userId;
}

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

export function validateEmail(email: unknown): email is string {
	return (
		typeof email === 'string' && email.length >= 3 && email.length <= 254 && EMAIL_REGEX.test(email)
	);
}

export function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
