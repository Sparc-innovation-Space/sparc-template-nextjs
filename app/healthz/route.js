// GET /healthz for SPARC Cloud's health check: 200 when everything (and the database, if any) answers.
import { pool } from "../../lib/db.js";

export const dynamic = "force-dynamic";

export async function GET() {
  // Next.js accepts requests a moment before the migrations (instrumentation.js) are done: not ready until then.
  if (!globalThis.__sparcMigrationsDone) {
    return new Response("starting (migrations)", { status: 503, headers: { "content-type": "text/plain" } });
  }
  try {
    if (pool) await pool.query("SELECT 1");
    return new Response("ok", { headers: { "content-type": "text/plain" } });
  } catch (err) {
    console.error("Health check: database not answering:", err.code || err.message);
    return new Response("database not answering", { status: 503, headers: { "content-type": "text/plain" } });
  }
}
