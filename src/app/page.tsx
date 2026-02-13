import Link from "next/link";

export default function Home() {
  return (
    <main style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Welcome</h2>
      <p style={{ margin: 0, opacity: 0.8 }}>
        Go to <Link href="/login">Login</Link> or <Link href="/dashboard">Dashboard</Link>.
      </p>
    </main>
  );
}