import "./globals.css";

export const metadata = {
  title: "My startup",
  description: "A website made from the SPARC Cloud Next.js template.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <a href="/">Home</a> · <a href="/about">About</a>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
