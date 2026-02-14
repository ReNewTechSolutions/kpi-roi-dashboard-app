/* =========================================================
   File: src/app/pricing/page.tsx
   Public pricing page (no auth). Uses ENV-driven name.
   ========================================================= */
   import Link from "next/link";

   export const dynamic = "force-static";
   
   export default function PricingPage() {
     const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "KPI + ROI Dashboard";
   
     return (
       <main style={styles.page}>
         <header style={styles.header}>
           <div style={styles.brand}>{appName}</div>
           <div style={styles.nav}>
             <Link href="/auth/login" style={styles.link}>
               Sign in
             </Link>
             <Link href="/auth/signup" style={styles.primaryLink}>
               Start Free
             </Link>
           </div>
         </header>
   
         <section style={styles.hero}>
           <h1 style={styles.h1}>Track KPIs, prove ROI, and scale across organizations.</h1>
           <p style={styles.p}>
             Deploy in minutes, stay secure with multi-tenant RLS, and upgrade when you’re ready for exports and
             collaboration.
           </p>
   
           <div style={styles.heroCtas}>
             <Link href="/auth/signup" style={styles.primaryLink}>
               Start Free
             </Link>
             <Link href="/auth/login" style={styles.link}>
               View Demo
             </Link>
           </div>
         </section>
   
         <section style={styles.grid}>
           <PlanCard
             title="Free"
             tagline="Get started with KPI tracking and ROI basics."
             price="$0"
             bullets={[
               "1 organization",
               "1 seat",
               "KPI history: last 3 months",
               "1 ROI scenario",
               "No exports",
             ]}
             ctaHref="/auth/signup"
             ctaText="Start Free"
           />
   
           <PlanCard
             title="Pro"
             tagline="For consultants and operators who want deeper history and exports."
             price="$29/mo"
             bullets={[
               "Up to 3 organizations",
               "Up to 3 seats",
               "KPI history: 24 months",
               "Up to 10 ROI scenarios",
               "CSV exports",
               "KPI charts",
             ]}
             ctaHref="/auth/signup"
             ctaText="Upgrade to Pro"
             badge="Most Popular"
           />
   
           <PlanCard
             title="Team"
             tagline="For agencies and teams collaborating across multiple workspaces."
             price="$99/mo"
             bullets={[
               "Up to 10 organizations (or unlimited)",
               "Up to 10 seats (or unlimited)",
               "Unlimited KPI history",
               "Unlimited ROI scenarios",
               "CSV exports (PDF optional)",
               "KPI charts",
               "Team-ready structure",
             ]}
             ctaHref="/auth/signup"
             ctaText="Upgrade to Team"
           />
         </section>
   
         <section style={styles.faq}>
           <h2 style={styles.h2}>FAQ</h2>
           <div style={styles.faqGrid}>
             <FaqItem
               q="Can I cancel anytime?"
               a="Yes — you can cancel from the billing portal."
             />
             <FaqItem
               q="Can I change plans later?"
               a="Yes — upgrade or downgrade anytime via the billing portal."
             />
             <FaqItem
               q="Is this multi-tenant secure?"
               a="Yes — data access is enforced by Supabase Row Level Security (RLS) scoped to organization membership."
             />
           </div>
         </section>
   
         <footer style={styles.footer}>
           <span style={{ opacity: 0.75 }}>© {new Date().getFullYear()} {appName}</span>
           <span style={{ opacity: 0.75 }}>Built with Next.js + Supabase</span>
         </footer>
       </main>
     );
   }
   
   function PlanCard(props: {
     title: string;
     tagline: string;
     price: string;
     bullets: string[];
     ctaHref: string;
     ctaText: string;
     badge?: string;
   }) {
     return (
       <div style={styles.card}>
         <div style={styles.cardTop}>
           <div>
             <div style={styles.planTitleRow}>
               <div style={styles.planTitle}>{props.title}</div>
               {props.badge ? <span style={styles.badge}>{props.badge}</span> : null}
             </div>
             <div style={styles.tagline}>{props.tagline}</div>
           </div>
           <div style={styles.price}>{props.price}</div>
         </div>
   
         <ul style={styles.ul}>
           {props.bullets.map((b) => (
             <li key={b} style={styles.li}>
               {b}
             </li>
           ))}
         </ul>
   
         <Link href={props.ctaHref} style={styles.primaryLinkBlock}>
           {props.ctaText}
         </Link>
       </div>
     );
   }
   
   function FaqItem({ q, a }: { q: string; a: string }) {
     return (
       <div style={styles.faqItem}>
         <div style={styles.faqQ}>{q}</div>
         <div style={styles.faqA}>{a}</div>
       </div>
     );
   }
   
   const styles: Record<string, React.CSSProperties> = {
     page: { maxWidth: 1080, margin: "0 auto", padding: 16, display: "grid", gap: 28 },
     header: {
       display: "flex",
       alignItems: "center",
       justifyContent: "space-between",
       borderBottom: "1px solid #eee",
       paddingBottom: 12,
     },
     brand: { fontWeight: 800, fontSize: 14, letterSpacing: 0.2 },
     nav: { display: "flex", gap: 10, alignItems: "center" },
     link: { textDecoration: "none", border: "1px solid #ddd", borderRadius: 999, padding: "10px 12px" },
     primaryLink: {
       textDecoration: "none",
       border: "1px solid #ddd",
       borderRadius: 999,
       padding: "10px 12px",
       background: "rgba(0,0,0,0.04)",
       fontWeight: 700,
     },
     hero: { display: "grid", gap: 12, padding: "18px 0" },
     h1: { margin: 0, fontSize: 40, lineHeight: "44px", letterSpacing: -0.4 },
     p: { margin: 0, fontSize: 15, opacity: 0.85, maxWidth: 680, lineHeight: "22px" },
     heroCtas: { display: "flex", gap: 10, marginTop: 6 },
     grid: { display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" },
     card: {
       border: "1px solid #ddd",
       borderRadius: 18,
       padding: 14,
       display: "grid",
       gap: 12,
     },
     cardTop: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" },
     planTitleRow: { display: "flex", alignItems: "center", gap: 8 },
     planTitle: { fontSize: 16, fontWeight: 800 },
     badge: {
       fontSize: 12,
       border: "1px solid #ddd",
       borderRadius: 999,
       padding: "4px 8px",
       background: "rgba(0,0,0,0.04)",
     },
     tagline: { fontSize: 13, opacity: 0.8, marginTop: 4, lineHeight: "18px" },
     price: { fontSize: 18, fontWeight: 800, whiteSpace: "nowrap" },
     ul: { margin: 0, paddingLeft: 18, display: "grid", gap: 6, fontSize: 13, opacity: 0.9 },
     li: { lineHeight: "18px" },
     primaryLinkBlock: {
       textDecoration: "none",
       border: "1px solid #ddd",
       borderRadius: 14,
       padding: "10px 12px",
       textAlign: "center",
       background: "rgba(0,0,0,0.04)",
       fontWeight: 800,
     },
     faq: { display: "grid", gap: 10, paddingTop: 10 },
     h2: { margin: 0, fontSize: 18 },
     faqGrid: { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" },
     faqItem: { border: "1px solid #ddd", borderRadius: 18, padding: 14, display: "grid", gap: 8 },
     faqQ: { fontWeight: 800 },
     faqA: { fontSize: 13, opacity: 0.85, lineHeight: "18px" },
     footer: { display: "flex", justifyContent: "space-between", borderTop: "1px solid #eee", paddingTop: 12 },
   };