# Next.js website — a SPARC Cloud template

A **Next.js 16** website (App Router, plain JavaScript, React 19). A database is **optional**: with one attached, the
home page counts visits in PostgreSQL. Telemetry is off (`NEXT_TELEMETRY_DISABLED=1` in every script).

```
app/page.js            the home page (rendered on every request)
app/about/page.js      a page built once at build time (fastest)
app/healthz/route.js   GET /healthz (checks the database when there is one)
app/layout.js          what every page shares (menu); app/globals.css = styles
lib/db.js, lib/migrate.js, instrumentation.js   database connection + migrations at server start
next.config.mjs        settings (no image cache on disk: the app may not write into its own folder)
package.json / package-lock.json   dependencies and their exact versions
sparc.json             port, health check, settings, database
```

## Run it on your computer

```sh
npm ci
npm run dev                              # http://localhost:3000 (no database needed)
# with a database:
docker run -d --name pg -e POSTGRES_USER=app -e POSTGRES_PASSWORD=app -e POSTGRES_DB=app -p 5432:5432 postgres:17-alpine
DATABASE_URL=postgresql://app:app@localhost:5432/app npm run dev
```

## Deploy on SPARC Cloud

1. Dashboard → **Templates** → *Next.js website* → **Create my copy on GitHub** (your account/organization, a
   repository name). The copy is yours.
2. **I've created it** → pick the new repository (**Refresh** if needed).
3. Review: port 8080, health check `/healthz`, settings `NEXT_TELEMETRY_DISABLED=1` and `NODE_ENV=production`, and
   an optional **PostgreSQL database** (choose **none** if you don't need one). **Create**.
4. SPARC Cloud builds it without a Dockerfile (`npm run build`) and starts it with `node_modules/.bin/next start`
   (sparc.json "start_command"; `next start` listens on `$PORT`). `/healthz` answers 503 until the migrations are done.

The app runs as user 1000 (not root). It never writes into its own folder: keep `images.unoptimized` and don't use
`revalidate` (ISR) — use `export const dynamic = "force-dynamic"` for pages that change.

## Change things

- **Add a page:** create `app/contact/page.js` (copy `app/about/page.js`) → it appears at `/contact`.
- **Add an API route:** `app/api/hello/route.js` with `export async function GET() { return Response.json({ hi: 1 }) }`.
- **Change the database:** ADD an entry to `MIGRATIONS` in `lib/migrate.js`; it runs once at the next start
  (`MIGRATIONS FAILED …` in the log = the new version does not start).
- **Settings:** `process.env.MY_SETTING` on the server. Values for the browser must start with `NEXT_PUBLIC_` and are
  fixed at BUILD time (rebuild after changing them).
- **Update packages:** `npm install next@<version>`, commit `package.json` and `package-lock.json`.

## Licence

MIT (see `LICENSE`). The copy you made is yours.
