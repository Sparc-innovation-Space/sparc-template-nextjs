// Next.js settings. On SPARC Cloud the app runs as user 1000 and may NOT write into its own folder (.next/):
// so no image optimization cache on disk (images are served as they are) and no pages that rebuild themselves
// on the server (ISR). Pages are either built once (`next build`) or rendered on every request.
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
