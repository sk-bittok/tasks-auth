import type { AppRouteHandler } from "@/lib/config-app.ts";
import type { IndexRoute } from "./index.route.js";

export const indexHandler: AppRouteHandler<IndexRoute> = (c) => {
	return c.json({ message: "Hello hono" });
};
