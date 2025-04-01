import { drizzle } from "drizzle-orm/node-postgres";
import env from "@/env.ts";

const db = drizzle(env.DATABASE_URL);

export default db;
