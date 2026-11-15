// The home page. It is rendered on every request (it counts visits when there is a database).
import { pool } from "../lib/db.js";

export const dynamic = "force-dynamic";

async function countVisit() {
  if (!pool) return null;
  await pool.query("INSERT INTO visits DEFAULT VALUES");
  const { rows } = await pool.query("SELECT count(*)::int AS n FROM visits");
  return rows[0].n;
}

export default async function Home() {
  const visits = await countVisit();
  return (
    <>
      <h1>It works</h1>
      <p>
        This page is <code>app/page.js</code>. Add a page: create <code>app/contact/page.js</code> and it appears at
        <code>/contact</code>.
      </p>
      <p>{visits === null ? "No database attached." : `Visits so far: ${visits}`}</p>
    </>
  );
}
