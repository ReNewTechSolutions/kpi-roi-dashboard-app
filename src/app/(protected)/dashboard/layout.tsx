// =========================================================
// File: src/app/layout.tsx
// Dark glass global shell + safe hydration
// =========================================================
import React from "react";
import type { Metadata } from "next";
import { APP_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  applicationName: APP_NAME,
  appleWebApp: { title: APP_NAME, capable: true, statusBarStyle: "default" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={styles.body}>
        {/* Background wash */}
        <div style={styles.bg} aria-hidden="true" />

        {/* Centered app frame */}
        <div style={styles.shell}>{children}</div>
      </body>
    </html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    margin: 0,
    minHeight: "100vh",
    color: "rgba(255,255,255,0.92)",
    background: "#070A12",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },

  bg: {
    position: "fixed",
    inset: 0,
    background:
      "radial-gradient(900px 600px at 20% 10%, rgba(86, 125, 255, 0.20), transparent 60%)," +
      "radial-gradient(900px 600px at 80% 20%, rgba(72, 205, 170, 0.16), transparent 55%)," +
      "radial-gradient(900px 700px at 50% 90%, rgba(255, 120, 180, 0.10), transparent 60%)," +
      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))",
    pointerEvents: "none",
    zIndex: 0,
  },

  shell: {
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "28px 16px",
  },
};