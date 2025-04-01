import { createRouter } from "@/lib/config-app.ts";
import { indexHandler } from "./index.handler.js";
import { indexRoute } from "./index.route.js";

const router = createRouter().openapi(indexRoute, indexHandler);

export default router;
