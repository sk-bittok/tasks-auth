import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCode from "@/http/status-codes.js";
import { z } from "zod";

export const indexRoute = createRoute({
	tags: ["Root"],
	path: "/",
	method: "get",
	responses: {
		[HttpStatusCode.OK]: {
			description: "Successful response",
			content: {
				"application/json": {
					schema: z.object({
						message: z.string(),
					}),
				},
			},
		},
		[HttpStatusCode.INTERNAL_SERVER_ERROR]: {
			description: "Internal server error",
			content: {
				"application/json": {
					schema: z.object({
						message: z.string(),
					}),
				},
			},
		},
	},
});

export type IndexRoute = typeof indexRoute;
