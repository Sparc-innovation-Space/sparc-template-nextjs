// The database is OPTIONAL. SPARC Cloud sets DATABASE_URL when you attach one (Database tab).
import pg from "pg";

const url = process.env.DATABASE_URL;

// One pool for the whole server process (kept on globalThis so `next dev` reloads don't open new ones).
export const pool = url ? (globalThis.__sparcPool ??= new pg.Pool({ connectionString: url, max: 5 })) : null;
