import createApp from "@/lib/config-app.ts";
import configureOpenAPi from "@/lib/config-openapi.js";
import index from "@/routes/index.js";
import auth from "@/routes/auth/auth.index.ts";
import tasks from "@/routes/tasks/tasks.index.ts";

const app = createApp();

configureOpenAPi(app);

const routes = [index, auth, tasks];

for (const route of routes) {
	app.route("/", route);
}

export default app;
