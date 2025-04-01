import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import process from "node:process";
import { z, type ZodError } from "zod";

expand(
	config({
		path: path.resolve(
			process.cwd(),
			process.env.NODE_ENV === "test" ? ".env.test" : ".env.development",
		),
	}),
);

const EnvSchema = z.object({
	NODE_ENV: z.string().default("development"),
	PORT: z.coerce.number().default(5350),
	LOG_LEVEL: z
		.enum(["silent", "trace", "debug", "info", "warn", "error"])
		.default("info"),
	DATABASE_URL: z.string().url(),
	JWT_SECRET: z.string().base64(),
});

export type Env = z.infer<typeof EnvSchema>;

let env: Env;

try {
	env = EnvSchema.parse(process.env);
} catch (e) {
	const error = e as ZodError;
	console.error(error.flatten().fieldErrors);
	process.exit(1);
}

export default env;
