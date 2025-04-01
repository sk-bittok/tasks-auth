import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";
import { createRoute } from "@hono/zod-openapi";
import {
	RegisterSchema,
	AuthResponse,
	LoginSchema,
	GenericResponse,
	LoginResponse,
	ForgotPasswordSchema,
	ResetPasswordSchema,
} from "./auth.schemas.ts";
import * as HttpStatusCode from "@/http/status-codes.ts";

export const register = createRoute({
	tags: ["Auth"],
	path: "/auth/register",
	method: "post",
	request: {
		body: jsonContentRequired(RegisterSchema, "Registration data"),
	},

	responses: {
		[HttpStatusCode.CREATED]: jsonContent(
			AuthResponse,
			"Successful registration",
		),
		[HttpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(RegisterSchema),
			"Invalid registration data",
		),
		[HttpStatusCode.CONFLICT]: jsonContent(
			GenericResponse,
			"Username or email already taken",
		),
		[HttpStatusCode.INTERNAL_SERVER_ERROR]: jsonContent(
			GenericResponse,
			"Internal server error",
		),
	},
});

export const login = createRoute({
	tags: ["Auth"],
	path: "/auth/login",
	method: "post",
	request: {
		body: jsonContentRequired(LoginSchema, "Login data"),
	},

	responses: {
		[HttpStatusCode.OK]: jsonContent(
			LoginResponse,
			"Successful authentication",
		),
		[HttpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(LoginSchema),
			"Invalid login data",
		),
		[HttpStatusCode.UNAUTHORIZED]: jsonContent(
			GenericResponse,
			"Invalid email or password",
		),
		[HttpStatusCode.INTERNAL_SERVER_ERROR]: jsonContent(
			GenericResponse,
			"Internal server error",
		),
	},
});

export const forgot = createRoute({
	tags: ["Auth"],
	path: "/auth/forgot",
	method: "post",
	request: {
		body: jsonContentRequired(ForgotPasswordSchema, "Login data"),
	},

	responses: {
		[HttpStatusCode.OK]: jsonContent(AuthResponse, "Successful email check"),
		[HttpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(ForgotPasswordSchema),
			"Invalid request data",
		),
		[HttpStatusCode.INTERNAL_SERVER_ERROR]: jsonContent(
			GenericResponse,
			"Internal server error",
		),
	},
});

export const reset = createRoute({
	tags: ["Auth"],
	path: "/auth/reset",
	method: "post",
	request: {
		body: jsonContentRequired(ResetPasswordSchema, "Reset password data"),
	},

	responses: {
		[HttpStatusCode.CREATED]: jsonContent(
			AuthResponse,
			"Successful password reset",
		),
		[HttpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(ResetPasswordSchema),
			"Invalid request data",
		),
		[HttpStatusCode.UNAUTHORIZED]: jsonContent(
			GenericResponse,
			"Invalid email or password",
		),
		[HttpStatusCode.INTERNAL_SERVER_ERROR]: jsonContent(
			GenericResponse,
			"Internal server error",
		),
	},
});

export type LoginRoute = typeof login;
export type RegisterRoute = typeof register;
export type ForgotRoute = typeof forgot;
export type ResetRoute = typeof reset;
