// Database changes, in order. ADD new entries at the end; never edit one that may already have run.
// They run once when the server starts (instrumentation.js), all in one transaction, one server at a time.
import { pool } from "./db.js";

const MIGRATIONS = [
  { id: 1, name: "create visits", sql: "CREATE TABLE visits (id serial PRIMARY KEY, at timestamptz NOT NULL DEFAULT now())" },
];
const MIGRATION_LOCK = 4211;

export async function migrate() {
  if (!pool) {
    console.log("No DATABASE_URL: running without a database.");
    return;
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1)", [MIGRATION_LOCK]);
    await client.query(
      "CREATE TABLE IF NOT EXISTS schema_migrations (id integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())",
    );
    const done = new Set((await client.query("SELECT id FROM schema_migrations")).rows.map((r) => r.id));
    let count = 0;
    for (const m of MIGRATIONS) {
      if (done.has(m.id)) continue;
      await client.query(m.sql);
      await client.query("INSERT INTO schema_migrations (id) VALUES ($1)", [m.id]);
      console.log(`Migration ${m.id} applied: ${m.name}`);
      count += 1;
    }
    await client.query("COMMIT");
    console.log(count ? `Database migrated (${count} new).` : "Database is up to date.");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}
