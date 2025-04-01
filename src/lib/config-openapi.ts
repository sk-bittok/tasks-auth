import { apiReference } from "@scalar/hono-api-reference";
import type { AppOpenApi } from "@/lib/config-app.ts";
import packageJSON from "../../package.json" with { type: "json" };

export default function configureOpenAPi(app: AppOpenApi) {
	app.doc("/doc", {
		openapi: "3.0.0",
		info: {
			version: packageJSON.version,
			title: "Tasks API",
		},
	});

	app.get(
		"/reference",
		apiReference({
			theme: "elysiajs",
			layout: "classic",
			spec: {
				url: "/doc",
			},
		}),
	);
}
