import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../helpers/env";
import * as schema from "./schema";

const client = postgres(env.SUPABASE_DB_URL);

export const orm = drizzle(client, { schema });
