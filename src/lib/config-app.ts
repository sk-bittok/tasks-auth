import { OpenAPIHono, type RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";
import logger from "@/middlewares/logger.js";
import {
	defaultHook,
	notFound,
	onError,
} from "@/middlewares/error-responses.js";
import type { RouteConfig } from "@asteasolutions/zod-to-openapi";

export interface AppBindings {
	Variables: {
		logger: PinoLogger;
	};
}

export type AppOpenApi = OpenAPIHono<AppBindings>;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
	R,
	AppBindings
>;

export function createRouter() {
	return new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
}

export default function createApp() {
	const app = createRouter();

	app.use(logger());
	app.onError(onError);
	app.notFound(notFound);
	app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
		type: "http",
		scheme: "bearer",
	});

	return app;
}
