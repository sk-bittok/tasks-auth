import * as jwt from "hono/jwt";
import { setCookie } from "hono/cookie";

import type {
	RegisterRoute,
	LoginRoute,
	ForgotRoute,
	ResetRoute,
} from "./auth.routes.ts";
import type { AppRouteHandler } from "@/lib/config-app.ts";
import * as userRepository from "@/db/users.ts";
import env from "@/env.ts";

const JWT_SECRET = env.JWT_SECRET;
const COOKIE_KEY = "authToken";

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
	const registerData = c.req.valid("json");

	const [register] = await userRepository.register(registerData);

	if (!register) {
		return c.json(
			{
				message:
					"Registration failed. Something went wrong during registration",
			},
			500,
		);
	}

	return c.json(
		{ message: `Successful registered as user ${register.username}` },
		201,
	);
};

export const login: AppRouteHandler<LoginRoute> = async (c) => {
	const loginData = c.req.valid("json");

	const user = await userRepository.login(loginData);

	const payload = {
		sub: user.pid,
		user: user.username,
		exp: Math.floor(Date.now() / 1000) + 3600,
	};
	const token = await jwt.sign(payload, JWT_SECRET);

	setCookie(c, COOKIE_KEY, token, {
		path: "/",
		domain: "localhost",
		httpOnly: true,
		sameSite: "lax",
	});
	return c.json(
		{
			authToken: token,
			pid: user.pid,
			username: user.username,
			createdAt: user.createdAt.toDateString(),
		},
		200,
	);
};

export const forgot: AppRouteHandler<ForgotRoute> = async (c) => {
	const forgotData = c.req.valid("json");

	const [user] = await userRepository.forgotPassword(forgotData.email);

	if (!user) {
		return c.json({ message: "Something went wrong on our end." }, 500);
	}

	// Mail the link to the user
	c.var.logger.info(
		`Reset token ${user.resetToken}, sent at ${user.resetTokenSentAt}`,
	);

	return c.json(
		{
			message:
				"A link containing instructions on how to reset your password has been sent to your inbox.",
		},
		200,
	);
};

/**
 * Handles the password reset functionality for the application.
 *
 * This route handler processes a password reset request by validating the incoming
 * JSON payload, updating the user's password in the repository, and logging relevant
 * information. If the operation is successful, it returns a success message; otherwise,
 * it returns an error response.
 *
 * @param c - The route context containing the request and response objects.
 * @returns A JSON response indicating the success or failure of the password reset operation.
 *
 * @throws Will return a 500 status code if the user cannot be found or the reset operation fails.
 */
export const reset: AppRouteHandler<ResetRoute> = async (c) => {
	const resetData = c.req.valid("json");
	const [user] = await userRepository.resetPassword(resetData);

	if (!user) {
		return c.json({ message: "Something went wrong on our end." }, 500);
	}

	c.var.logger.info(`${user.resetToken}, ${user.resetTokenSentAt}`);

	return c.json({ message: "Password reset succesfully" }, 201);
};
