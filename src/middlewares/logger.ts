import { pinoLogger } from "hono-pino";
import pretty from "pino-pretty";
import env from "@/env.js";
import pino from "pino";

function logger() {
	return pinoLogger({
		pino: pino.default(
			{
				level: env.LOG_LEVEL || "info",
			},
			env.NODE_ENV === "production" ? undefined : pretty(),
		),
	});
}

export default logger;
