import type { Hook } from "@hono/zod-openapi";
import {
	UNPROCESSABLE_ENTITY,
	NOT_FOUND,
	OK,
	INTERNAL_SERVER_ERROR,
} from "@/http/status-codes.js";
import type { ErrorHandler, NotFoundHandler } from "hono";
import type { ContentfulStatusCode, StatusCode } from "hono/utils/http-status";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const defaultHook: Hook<any, any, any, any> = (result, c) => {
	if (!result.success) {
		return c.json(
			{
				success: result.success,
				error: result.error,
			},
			UNPROCESSABLE_ENTITY,
		);
	}
};

export const onError: ErrorHandler = (err, c) => {
	const currentStatus =
		"status" in err ? err.status : c.newResponse(null).status;
	const statusCode =
		currentStatus !== OK
			? (currentStatus as StatusCode)
			: INTERNAL_SERVER_ERROR;

	const message =
		statusCode === INTERNAL_SERVER_ERROR
			? "Something went wrong on our end."
			: err.message;
	return c.json({ message }, statusCode as ContentfulStatusCode);
};

export const notFound: NotFoundHandler = (c) => {
	return c.json(
		{
			message: `Path ${c.req.path} does not exist`,
		},
		NOT_FOUND,
	);
};
