import Nav from "@/components/Nav";

export const metadata = {
  title: "KPI + ROI Dashboard App",
  description: "Micro-SaaS KPI and ROI dashboard with Supabase backend.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ maxWidth: 980, margin: "0 auto", padding: 18, fontFamily: "system-ui, sans-serif" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>KPI + ROI Dashboard</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Vercel-ready Micro-SaaS</div>
          </div>
        </header>
        <Nav />
        {children}
      </body>
    </html>
  );
}