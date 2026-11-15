// Runs once when the Next.js server starts: the database migrations. If they fail, the server stops with a clear
// line in the log and never becomes ready (SPARC Cloud keeps the old version running).
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { migrate } = await import("./lib/migrate.js");
  try {
    await migrate();
    globalThis.__sparcMigrationsDone = true;   // /healthz answers 200 only from now on
  } catch (err) {
    console.error("MIGRATIONS FAILED - the app will not start:", err.code || "", err.message);
    process.exit(1);
  }
}
