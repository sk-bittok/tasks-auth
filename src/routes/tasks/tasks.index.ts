import { createRouter } from "@/lib/config-app.ts";
import * as handlers from "./tasks.handlers.ts";
import * as routers from "./tasks.routes.ts";

const router = createRouter()
    .openapi(routers.create, handlers.create)
    .openapi(routers.list, handlers.list)
    .openapi(routers.one, handlers.one)
    .openapi(routers.update, handlers.update)
    .openapi(routers.remove, handlers.remove);

export default router;
