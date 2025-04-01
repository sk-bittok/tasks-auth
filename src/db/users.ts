import db from "@/db/index.ts";
import { usersTable } from "@/db/schema.ts";
import argon2 from "argon2";
import type { UUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import * as uuid from "uuid";

/**
 * Hashes a plain text password using the Argon2 algorithm.
 *
 * @param plain - The plain text password to be hashed.
 * @returns A promise that resolves to the hashed password.
 * @throws HTTPException - Throws an HTTPException with a 500 status code if an error occurs during hashing.
 */
const hashPassword = async (plain: string) => {
	try {
		const hash = await argon2.hash(plain);
		return hash;
	} catch (e) {
		console.error(e);
		throw new HTTPException(500, {
			message: "Internal server error",
			cause: e,
		});
	}
};

/**
 * Verifies if a plain text password matches a hashed password.
 *
 * @param plain - The plain text password to verify.
 * @param hashed - The hashed password to compare against.
 * @returns A promise that resolves to `true` if the passwords match, otherwise `false`.
 * @throws {HTTPException} Throws an HTTPException with a 500 status code if an error occurs during verification.
 */
export const verifyPassword = async (plain: string, hashed: string) => {
	try {
		if (await argon2.verify(hashed, plain)) {
			return true;
		}
		return false;
	} catch (e) {
		console.error(e);
		throw new HTTPException(500, {
			message: "Something went wrong on our end",
			cause: e,
		});
	}
};

export const list = async () => {
	try {
		const users = await db.select().from(usersTable).orderBy(usersTable.id);

		return users;
	} catch (e) {
		console.error(e);

		throw new HTTPException(500, {
			message: "Something went wrong during registration",
			cause: e,
		});
	}
};

export const one = async (id: number) => {
	const [user] = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.id, id));

	if (!user) {
		throw new HTTPException(404, {
			message: "User not found",
			cause: `User with ID ${id} does not exist`,
		});
	}

	return user;
};

export const update = async ({
	id,
	username,
	email,
	password,
}: { id: number; username?: string; email?: string; password?: string }) => {
	const user = await one(id);

	let newPassword: string;

	if (password !== undefined) {
		const hashed = await hashPassword(password);
		newPassword = hashed;
	} else {
		newPassword = user.password;
	}

	const data = {
		username: username !== undefined ? username : user.username,
		email: email !== undefined ? email : user.email,
		password: newPassword,
	};

	const [query] = await db
		.update(usersTable)
		.set(data)
		.where(eq(usersTable.id, id))
		.returning();

	if (!query) {
		throw new HTTPException(404, {
			message: "User not found",
			cause: "Could be many things",
		});
	}

	return query;
};

export const remove = async (id: number) => {
	const [query] = await db
		.delete(usersTable)
		.where(eq(usersTable.id, id))
		.returning();

	if (!query) {
		throw new HTTPException(404, {
			message: "User not found",
			cause: `User with ID ${id} does not exist`,
		});
	}

	return query;
};

/**
 * Finds a user in the database by their email address.
 *
 * @param email - The email address of the user to search for.
 * @returns A promise that resolves to the user data if found.
 * @throws {HTTPException} If no user with the specified email is found,
 * an HTTPException with a 404 status code is thrown.
 */
export const findByEmail = async (email: string) => {
	const [user] = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.email, email));

	if (!user) {
		throw new HTTPException(404, {
			message: "User not found",
			cause: `No user with email ${email} in the database`,
		});
	}

	return user;
};

/**
 * Finds a user in the database by their username.
 *
 * @param username - The username of the user to search for.
 * @returns A promise that resolves to the user data if found.
 * @throws {HTTPException} If no user with the specified username is found,
 * an HTTPException with a 404 status code is thrown.
 */
export const findByUsername = async (username: string) => {
	const [user] = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.username, username));

	if (!user) {
		throw new HTTPException(404, {
			message: "User not found",
			cause: `No user with username ${username} in the database`,
		});
	}

	return await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.username, username));
};

/**
 * Finds a user in the database by their reset password token.
 *
 * @param token - The reset password token to search for.
 * @returns A promise that resolves to the user object if found.
 * @throws {HTTPException} If no user is found with the provided reset token.
 *
 * @example
 * ```typescript
 * try {
 *   const user = await findByResetToken("some-reset-token");
 *   console.log(user);
 * } catch (error) {
 *   if (error instanceof HTTPException && error.status === 404) {
 *     console.error("User not found:", error.message);
 *   }
 * }
 * ```
 */
export const findByResetToken = async (token: string) => {
	const [user] = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.resetToken, token));

	if (!user) {
		throw new HTTPException(404, {
			message: "User not found",
			cause: "Reset password token not found in the database",
		});
	}

	return user;
};

/**
 * Finds a user in the database by their PID (Primary Identifier).
 *
 * @param pid - The unique identifier (UUID) of the user to search for.
 * @returns A promise that resolves to the user object if found.
 * @throws {HTTPException} Throws a 404 HTTPException if the user is not found in the database.
 */
export const findByPid = async (pid: UUID) => {
	const [user] = await db.select().from(usersTable).where(
		eq(usersTable.pid, pid),
	);

	if (!user) {
		throw new HTTPException(404, {
			message: "User not found",
			cause: "User PID not found in the database",
		});
	}

	return user;
};

export const findByClaimsKey = async (claimsKey: string) => {
	const pid = uuid.parse(claimsKey);
	return await findByPid(pid as unknown as `${string}-${string}-${string}-${string}-${string}`);
};

/**
 * Registers a new user by validating the provided email and username,
 * ensuring they are unique, hashing the password, and storing the user
 * information in the database.
 *
 * @param {Object} params - The user registration details.
 * @param {string} params.email - The email address of the user.
 * @param {string} params.username - The desired username of the user.
 * @param {string} params.password - The plain text password of the user.
 * @throws {HTTPException} Throws a 409 HTTPException if the email is already registered.
 * @throws {HTTPException} Throws a 409 HTTPException if the username is already taken.
 * @returns {Promise<any>} A promise that resolves to the newly created user record.
 */
export const register = async ({
	email,
	username,
	password,
}: {
	username: string;
	email: string;
	password: string;
}) => {
	// Check to see that a user with that email or username does not exist;
	const [emailExists] = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.email, email));
	if (emailExists) {
		throw new HTTPException(409, {
			message: "User with that email already exists",
			cause: `${email} is already registered`,
		});
	}

	// Confirm that the username is not taken
	const [usernameTaken] = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.username, username));
	if (usernameTaken) {
		throw new HTTPException(409, {
			message: "Username is already taken",
			cause: `${username} is not available`,
		});
	}

	const data = {
		email: email.trim(),
		username: username.trim(),
		// Hash the password
		password: await hashPassword(password.trim()),
	};

	return await db.insert(usersTable).values(data).returning();
};

/**
 * Authenticates a user by verifying their email and password.
 *
 * @param params - An object containing the user's email and password.
 * @param params.email - The email address of the user.
 * @param params.password - The plaintext password of the user.
 * @returns The authenticated user object if the email and password are valid.
 * @throws {HTTPException} If the email does not exist in the database.
 * @throws {HTTPException} If the password does not match the stored hash.
 */
export const login = async ({
	email,
	password,
}: { email: string; password: string }) => {
	const [user] = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.email, email.trim()));

	if (!user) {
		throw new HTTPException(401, {
			message: "Invalid email or password",
			cause: "No user with that email",
		});
	}

	const isPasswordValid = await verifyPassword(password, user.password);
	if (!isPasswordValid) {
		throw new HTTPException(401, {
			message: "Invalid email or password",
			cause: "Password does not match",
		});
	}

	return user;
};

/**
 * Handles the process of initiating a password reset for a user by generating
 * a reset token and updating the user's record in the database.
 *
 * @param email - The email address of the user requesting a password reset.
 * @returns A promise that resolves to the updated user record with the reset token
 * and the timestamp when the reset token was sent.
 *
 * @throws Will throw an error if the user with the provided email does not exist.
 */
export const forgotPassword = async (email: string) => {
	// Ensure that the user with that email exists
	const user = await findByEmail(email);

	const data = {
		// Generate a random UUID for the reset token
		resetToken: crypto.randomUUID().toString(),
		resetTokenSentAt: new Date(),
	};

	return await db
		.update(usersTable)
		.set(data)
		.where(eq(usersTable.id, user.id))
		.returning();
};

/**
 * Resets the password for a user identified by a reset token.
 *
 * @param params - An object containing the reset token and the new password.
 * @param params.token - The reset token used to identify the user.
 * @param params.password - The new password to be set for the user.
 * @returns A promise that resolves to the updated user record after the password reset.
 *
 * @throws Will throw an error if the user cannot be found using the provided reset token.
 */
export const resetPassword = async ({
	token,
	password,
}: { token: string; password: string }) => {
	const user = await findByResetToken(token);

	return await db
		.update(usersTable)
		.set({
			resetToken: null,
			resetTokenSentAt: null,
			password: await hashPassword(password),
		})
		.where(eq(usersTable.id, user.id))
		.returning();
};
