import * as routes from "@/routes/auth/auth.routes.ts";
import * as handlers from "@/routes/auth/auth.handlers.ts";
import { createRouter } from "@/lib/config-app.ts";

const router = createRouter()
	.openapi(routes.register, handlers.register)
	.openapi(routes.login, handlers.login)
	.openapi(routes.forgot, handlers.forgot)
	.openapi(routes.reset, handlers.reset);

export default router;
