// A page that is built ONCE (at `next build`) and served as it is: fastest.
export const metadata = { title: "About" };

export default function About() {
  return (
    <>
      <h1>About us</h1>
      <p>Tell visitors who you are. This page is <code>app/about/page.js</code>.</p>
    </>
  );
}
