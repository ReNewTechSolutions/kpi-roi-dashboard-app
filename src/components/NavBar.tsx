// =========================================================
// File: src/components/NavBar.tsx
// Premium glass (dark) + Stripe-free + Mobile drawer:
// - Desktop: inline nav
// - Mobile: hamburger -> drawer (nav + account actions)
// - No route/logic changes
// =========================================================
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import SwitchOrgModal from "@/components/orgs/SwitchOrgModal";

type NavItem = { href: string; label: string; startsWith?: boolean };
type MenuItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "action"; label: string; onSelect: () => void; disabled?: boolean }
  | { kind: "divider" };

function isActive(pathname: string, item: NavItem) {
  if (item.startsWith) return pathname === item.href || pathname.startsWith(item.href + "/");
  return pathname === item.href;
}

function useOnClickOutside<T extends HTMLElement>(ref: React.RefObject<T>, handler: () => void) {
  useEffect(() => {
    function onDown(e: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      handler();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [ref, handler]);
}

function nextEnabledIndex(items: MenuItem[], from: number, dir: 1 | -1) {
  const n = items.length;
  for (let step = 1; step <= n; step += 1) {
    const idx = (from + dir * step + n) % n;
    const it = items[idx];
    if (it.kind === "divider") continue;
    if (it.kind === "action" && it.disabled) continue;
    return idx;
  }
  return from;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    // Safari < 14 fallback
    if (typeof mql.addEventListener === "function") mql.addEventListener("change", onChange);
    else mql.addListener(onChange);
    return () => {
      if (typeof mql.removeEventListener === "function") mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

export default function NavBar({
  userEmail,
  currentOrgId,
  currentOrgName,
  currentOrgRole,
}: {
  userEmail: string | null;
  currentOrgId: string | null;
  currentOrgName?: string | null;
  currentOrgRole?: "owner" | "member" | null;
}) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 860px)");

  const [open, setOpen] = useState(false); // desktop profile menu
  const [drawerOpen, setDrawerOpen] = useState(false); // mobile drawer
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const [signoutBusy, setSignoutBusy] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuItemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([]);

  useOnClickOutside(rootRef, () => setOpen(false));
  useEffect(() => {
    setOpen(false);
    setDrawerOpen(false);
  }, [pathname]);

  // Close drawer when switching to desktop
  useEffect(() => {
    if (!isMobile) setDrawerOpen(false);
  }, [isMobile]);

  const navItems: NavItem[] = useMemo(
    () => [
      { href: "/dashboard", label: "Dashboard", startsWith: true },
      { href: "/metrics", label: "Metrics", startsWith: true },
      { href: "/org", label: "Org", startsWith: true },
      { href: "/roi", label: "ROI", startsWith: true },
      { href: "/settings", label: "Settings", startsWith: true },
      { href: "/legal/privacy", label: "Legal", startsWith: true },
    ],
    [],
  );

  const displayName = userEmail ?? "Account";
  const initials = (userEmail?.trim()?.[0] ?? "U").toUpperCase();

  async function signOut() {
    if (signoutBusy) return;
    setSignoutBusy(true);
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } finally {
      setSignoutBusy(false);
      router.push("/auth/login");
      router.refresh();
    }
  }

  const menuItems: MenuItem[] = useMemo(() => {
    const base: MenuItem[] = [
      { kind: "link", label: "Settings", href: "/settings" },
      {
        kind: "action",
        label: "Switch org",
        onSelect: () => {
          setOpen(false);
          setDrawerOpen(false);
          setOrgModalOpen(true);
        },
      },
      { kind: "divider" },
      { kind: "link", label: "Privacy (public)", href: "/privacy" },
    ];

    if (currentOrgId) base.push({ kind: "link", label: "Privacy (org view)", href: "/legal/privacy" });

    base.push({ kind: "link", label: "Terms", href: "/terms" });
    base.push({ kind: "divider" });
    base.push({
      kind: "action",
      label: signoutBusy ? "Signing out..." : "Sign out",
      disabled: signoutBusy,
      onSelect: () => {
        setOpen(false);
        setDrawerOpen(false);
        void signOut();
      },
    });

    return base;
  }, [currentOrgId, signoutBusy]);

  // Desktop profile menu focus mgmt
  useEffect(() => {
    if (!open) return;
    const first = menuItems.findIndex((it) => it.kind !== "divider" && !(it.kind === "action" && it.disabled));
    const idx = first >= 0 ? first : 0;
    setActiveMenuIndex(idx);
    const t = window.setTimeout(() => menuItemRefs.current[idx]?.focus?.(), 0);
    return () => window.clearTimeout(t);
  }, [open, menuItems]);

  function closeAndReturnFocus() {
    setOpen(false);
    window.setTimeout(() => buttonRef.current?.focus?.(), 0);
  }

  function onProfileKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  function onMenuKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!open) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeAndReturnFocus();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const dir: 1 | -1 = e.shiftKey ? -1 : 1;
      const next = nextEnabledIndex(menuItems, activeMenuIndex, dir);
      setActiveMenuIndex(next);
      menuItemRefs.current[next]?.focus?.();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = nextEnabledIndex(menuItems, activeMenuIndex, 1);
      setActiveMenuIndex(next);
      menuItemRefs.current[next]?.focus?.();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = nextEnabledIndex(menuItems, activeMenuIndex, -1);
      setActiveMenuIndex(next);
      menuItemRefs.current[next]?.focus?.();
      return;
    }
  }

  function onSelectMenuItem(item: MenuItem, index: number) {
    if (item.kind === "divider") return;

    if (item.kind === "link") {
      setOpen(false);
      setDrawerOpen(false);
      router.push(item.href);
      router.refresh();
      return;
    }

    if (item.kind === "action") {
      if (item.disabled) return;
      item.onSelect();
      setActiveMenuIndex(index);
    }
  }

  const roleLabel = currentOrgRole ? (currentOrgRole === "owner" ? "Owner" : "Member") : null;
  const orgBase = currentOrgName?.trim() || (currentOrgId ? `${currentOrgId.slice(0, 8)}…` : null);
  const orgLabel = orgBase ? `Org: ${orgBase}${roleLabel ? ` (${roleLabel})` : ""}` : null;

  // Escape closes drawer
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <>
      <nav style={styles.nav}>
        {/* Left: brand-ish + hamburger on mobile */}
        <div style={styles.left}>
          {isMobile ? (
            <button
              type="button"
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen}
              style={{ ...styles.iconBtn, ...(drawerOpen ? styles.iconBtnOn : null) }}
            >
              <span aria-hidden="true" style={{ fontSize: 16, lineHeight: "16px" }}>
                {drawerOpen ? "✕" : "☰"}
              </span>
            </button>
          ) : (
            navItems.map((item) => {
              const active = isActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  style={{
                    ...styles.pill,
                    ...(active ? styles.pillActive : styles.pillInactive),
                  }}
                >
                  {item.label}
                </Link>
              );
            })
          )}
        </div>

        <div style={styles.right}>
          {orgLabel ? <span style={styles.orgPill}>{orgLabel}</span> : null}

          {/* Desktop profile dropdown */}
          {!isMobile ? (
            <div ref={rootRef} style={{ position: "relative" }}>
              <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                onKeyDown={onProfileKeyDown}
                style={{
                  ...styles.profileButton,
                  ...(open ? styles.profileButtonOpen : null),
                }}
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <span aria-hidden="true" style={styles.avatar}>
                  {initials}
                </span>
                <span style={styles.profileText}>{displayName}</span>
                <span aria-hidden="true" style={styles.caret}>
                  ▾
                </span>
              </button>

              {open ? (
                <div role="menu" aria-label="Profile menu" style={styles.menu} onKeyDown={onMenuKeyDown}>
                  {userEmail ? (
                    <div style={styles.menuHeader}>
                      <div style={styles.menuLabel}>Signed in as</div>
                      <div style={styles.menuEmail} title={userEmail}>
                        {userEmail}
                      </div>
                    </div>
                  ) : null}

                  <div style={styles.menuDivider} />

                  <div style={{ padding: 6, display: "grid", gap: 6 }}>
                    {menuItems.map((item, i) => {
                      if (item.kind === "divider") return <div key={`div-${i}`} style={styles.inlineDivider} />;

                      if (item.kind === "link") {
                        return (
                          <a
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            ref={(el) => {
                              menuItemRefs.current[i] = el;
                            }}
                            style={styles.menuItem}
                            onClick={(e) => {
                              e.preventDefault();
                              onSelectMenuItem(item, i);
                            }}
                          >
                            {item.label}
                          </a>
                        );
                      }

                      return (
                        <button
                          key={`${item.label}-${i}`}
                          type="button"
                          role="menuitem"
                          aria-disabled={item.disabled || undefined}
                          disabled={item.disabled}
                          ref={(el) => {
                            menuItemRefs.current[i] = el;
                          }}
                          style={{
                            ...styles.menuItem,
                            ...(item.disabled ? styles.menuItemDisabled : null),
                          }}
                          onClick={() => onSelectMenuItem(item, i)}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            // Mobile: show a compact account chip (opens drawer too)
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              style={styles.mobileAccountChip}
              aria-label="Open account menu"
            >
              <span aria-hidden="true" style={styles.avatarSmall}>
                {initials}
              </span>
              <span style={{ fontSize: 12, fontWeight: 900, opacity: 0.9 }}>Menu</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile drawer + backdrop */}
      {drawerOpen ? (
        <div style={styles.drawerOverlay} role="dialog" aria-modal="true">
          <div style={styles.drawer}>
            <div style={styles.drawerTop}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={styles.drawerAvatar}>{initials}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 950, fontSize: 13, color: "rgba(255,255,255,0.92)" }}>
                    {displayName}
                  </div>
                  <div style={{ marginTop: 2, fontSize: 12, opacity: 0.7, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {orgLabel ?? "No organization selected"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                style={styles.drawerClose}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div style={styles.drawerSectionLabel}>Navigation</div>
            <div style={{ display: "grid", gap: 8 }}>
              {navItems.map((item) => {
                const active = isActive(pathname, item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    style={{
                      ...styles.drawerNavItem,
                      ...(active ? styles.drawerNavItemActive : null),
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div style={styles.drawerDivider} />

            <div style={styles.drawerSectionLabel}>Account</div>
            <div style={{ display: "grid", gap: 8 }}>
              {menuItems.map((it, i) => {
                if (it.kind === "divider") return <div key={`md-${i}`} style={styles.drawerInlineDivider} />;

                if (it.kind === "link") {
                  return (
                    <Link
                      key={it.href}
                      href={it.href}
                      onClick={() => setDrawerOpen(false)}
                      style={styles.drawerAction}
                    >
                      {it.label}
                    </Link>
                  );
                }

                return (
                  <button
                    key={`${it.label}-${i}`}
                    type="button"
                    onClick={() => onSelectMenuItem(it, i)}
                    disabled={it.disabled}
                    style={{
                      ...styles.drawerAction,
                      ...(it.disabled ? styles.drawerActionDisabled : null),
                    }}
                  >
                    {it.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            aria-label="Close overlay"
            onClick={() => setDrawerOpen(false)}
            style={styles.drawerBackdrop}
          />
        </div>
      ) : null}

      <SwitchOrgModal open={orgModalOpen} onClose={() => setOrgModalOpen(false)} currentOrgId={currentOrgId} />
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 12,
    color: "rgba(255,255,255,0.92)",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  right: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
  },
  iconBtnOn: {
    background: "rgba(255,255,255,0.10)",
    borderColor: "rgba(255,255,255,0.18)",
  },

  pill: {
    padding: "8px 12px",
    borderRadius: 999,
    textDecoration: "none",
    fontSize: 13,
    lineHeight: "16px",
    userSelect: "none",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.88)",
    transition: "transform 120ms ease, background 120ms ease, border-color 120ms ease",
  },

  pillActive: {
    fontWeight: 900,
    background: "rgba(255,255,255,0.10)",
    borderColor: "rgba(255,255,255,0.18)",
    transform: "translateY(-1px)",
    color: "rgba(255,255,255,0.96)",
  },

  pillInactive: {
    fontWeight: 700,
    opacity: 0.92,
  },

  orgPill: {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    fontSize: 12,
    fontWeight: 900,
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.90)",
    whiteSpace: "nowrap",
    maxWidth: 360,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  profileButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    transition: "background 120ms ease, border-color 120ms ease, transform 120ms ease",
  },

  profileButtonOpen: {
    background: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.18)",
    transform: "translateY(-1px)",
  },

  avatar: {
    width: 26,
    height: 26,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.25)",
    display: "grid",
    placeItems: "center",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.4,
  },

  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.25)",
    display: "grid",
    placeItems: "center",
    fontSize: 12,
    fontWeight: 900,
  },

  profileText: {
    maxWidth: 220,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: 12,
    opacity: 0.9,
    fontWeight: 800,
  },

  caret: { fontSize: 12, opacity: 0.75 },

  mobileAccountChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
  },

  menu: {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    width: 320,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 14, 24, 0.92)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
    overflow: "hidden",
    zIndex: 50,
  },

  menuHeader: { padding: 12 },
  menuLabel: { fontSize: 12, opacity: 0.7, marginBottom: 4, color: "rgba(255,255,255,0.70)" },
  menuEmail: {
    fontSize: 13,
    fontWeight: 800,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "rgba(255,255,255,0.92)",
  },

  menuDivider: { height: 1, background: "rgba(255,255,255,0.08)" },
  inlineDivider: { height: 1, background: "rgba(255,255,255,0.08)", margin: "6px 8px" },

  menuItem: {
    width: "100%",
    textAlign: "left",
    padding: "10px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.00)",
    background: "rgba(255,255,255,0.00)",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 800,
    color: "rgba(255,255,255,0.90)",
  },

  menuItemDisabled: { opacity: 0.55, cursor: "not-allowed" },

  // Drawer
  drawerOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 200,
    display: "grid",
    gridTemplateColumns: "min(360px, 86vw) 1fr",
  },

  drawer: {
    position: "relative",
    height: "100%",
    padding: 12,
    background: "rgba(12, 14, 24, 0.94)",
    borderRight: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.65)",
    overflowY: "auto",
  },

  drawerBackdrop: {
    border: "none",
    background: "rgba(0,0,0,0.35)",
    cursor: "pointer",
  },

  drawerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: 8,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.05)",
  },

  drawerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.30)",
    display: "grid",
    placeItems: "center",
    fontWeight: 950,
    color: "rgba(255,255,255,0.90)",
  },

  drawerClose: {
    width: 38,
    height: 38,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.90)",
    cursor: "pointer",
  },

  drawerSectionLabel: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.4,
    color: "rgba(255,255,255,0.70)",
    paddingLeft: 4,
  },

  drawerNavItem: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    textDecoration: "none",
    color: "rgba(255,255,255,0.90)",
    fontWeight: 850,
    fontSize: 13,
  },

  drawerNavItemActive: {
    background: "rgba(255,255,255,0.10)",
    borderColor: "rgba(255,255,255,0.18)",
  },

  drawerDivider: {
    height: 1,
    background: "rgba(255,255,255,0.08)",
    margin: "14px 0",
  },

  drawerInlineDivider: {
    height: 1,
    background: "rgba(255,255,255,0.08)",
    margin: "6px 0",
  },

  drawerAction: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.90)",
    fontWeight: 850,
    fontSize: 13,
    textDecoration: "none",
    cursor: "pointer",
    textAlign: "left",
  },

  drawerActionDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};