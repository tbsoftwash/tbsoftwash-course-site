import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>TBSoftWash Course Site (Next.js)</h1>
      <p>This is the web delivery layer for the course content in the course repo.</p>
      <ul>
        <li>
          <Link href="/course">Course Index</Link>
        </li>
      </ul>
    </main>
  );
}
