import { z } from "zod";

export const AuthResponse = z.object({
	message: z.string(),
});

export const LoginResponse = z.object({
	authToken: z.string(),
	pid: z.string(),
	username: z.string(),
	createdAt: z.string(),
});

export const GenericResponse = z.object({
	message: z.string(),
});

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, { message: "Password is required" }),
});

export const RegisterSchema = z
	.object({
		username: z
			.string()
			.min(5, { message: "Username requires 5 characters" })
			.max(48, { message: "Username must be under 48 characters" }),
		email: z.string().email(),
		password: z
			.string()
			.min(8, { message: "Password requires 8 characters" })
			.max(48, { message: "Password must be under 48 characters" }),
		confirmPassword: z
			.string()
			.min(1, { message: "Confirm Password is required" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords must match",
	});

export const ForgotPasswordSchema = z.object({
	email: z.string().email(),
});

export const ResetPasswordSchema = z
	.object({
		token: z.string().uuid(),
		password: z
			.string()
			.min(8, { message: "Password requires 8 characters" })
			.max(48, { message: "Password must be under 48 characters" }),
		confirmPassword: z
			.string()
			.min(1, { message: "Confirm Password is required" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords must match",
	});
