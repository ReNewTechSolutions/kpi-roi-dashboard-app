/* =========================================================
   File: src/components/NavBar.tsx
   Rewrite:
   - Supports org pill: "Org: {name} (Owner|Member)" with fallback to id prefix
   - Clicking org pill opens SwitchOrgModal (your YES to a)
   - Upgrade pill remains (owners on free only)
   - Legal pill in top nav + legal links in menu
   ========================================================= */
   "use client";

   import React, { useEffect, useMemo, useRef, useState } from "react";
   import Link from "next/link";
   import { usePathname, useRouter } from "next/navigation";
   import SwitchOrgModal from "@/components/orgs/SwitchOrgModal";
   import { getSupabaseBrowserClient } from "@/lib/supabase";
   
   type NavItem = { href: string; label: string; startsWith?: boolean };
   type MenuItem =
     | { kind: "link"; label: string; href: string }
     | { kind: "action"; label: string; onSelect: () => void; disabled?: boolean }
     | { kind: "divider" };
   
   type BillingSummary = { isOwner: boolean; plan: "free" | "pro" | "team" };
   
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
   
   async function fetchBillingSummary(orgId: string): Promise<BillingSummary> {
     const res = await fetch(`/api/billing/summary?orgId=${encodeURIComponent(orgId)}`, { cache: "no-store" });
     const json = (await res.json()) as BillingSummary & { error?: string };
     if (!res.ok) throw new Error(json.error ?? "Failed to load billing summary");
     return json;
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
   
     const [open, setOpen] = useState(false);
     const [orgModalOpen, setOrgModalOpen] = useState(false);
     const [activeMenuIndex, setActiveMenuIndex] = useState(0);
     const [signoutBusy, setSignoutBusy] = useState(false);
     const [billing, setBilling] = useState<BillingSummary | null>(null);
   
     const rootRef = useRef<HTMLDivElement>(null);
     const buttonRef = useRef<HTMLButtonElement>(null);
     const menuItemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([]);
   
     useOnClickOutside(rootRef, () => setOpen(false));
     useEffect(() => setOpen(false), [pathname]);
   
     useEffect(() => {
       let alive = true;
       (async () => {
         try {
           if (!currentOrgId) {
             if (alive) setBilling(null);
             return;
           }
           const data = await fetchBillingSummary(currentOrgId);
           if (alive) setBilling(data);
         } catch {
           if (alive) setBilling(null);
         }
       })();
       return () => {
         alive = false;
       };
     }, [currentOrgId]);
   
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
   
     const showUpgradePill = !!currentOrgId && billing?.isOwner === true && billing?.plan === "free";
   
     const roleLabel = currentOrgRole ? (currentOrgRole === "owner" ? "Owner" : "Member") : null;
     const orgBase = currentOrgName?.trim() || (currentOrgId ? `${currentOrgId.slice(0, 8)}…` : null);
     const orgPillText = orgBase ? `Org: ${orgBase}${roleLabel ? ` (${roleLabel})` : ""}` : null;
   
     const displayName = userEmail ?? "Account";
     const initials = (userEmail?.trim()?.[0] ?? "U").toUpperCase();
   
     async function signOut() {
       if (signoutBusy) return;
       setSignoutBusy(true);
       try {
         const supabase = await getSupabaseBrowserClient();
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
           void signOut();
         },
       });
   
       return base;
     }, [currentOrgId, signoutBusy]);
   
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
   
     return (
       <>
         <nav style={styles.nav}>
           <div style={styles.left}>
             {navItems.map((item) => {
               const active = isActive(pathname, item);
               return (
                 <Link
                   key={item.href}
                   href={item.href}
                   aria-current={active ? "page" : undefined}
                   style={{
                     ...styles.pill,
                     ...(active ? styles.pillActive : styles.pillInactive),
                   }}
                   onClick={() => setOpen(false)}
                 >
                   {item.label}
                 </Link>
               );
             })}
           </div>
   
           <div style={styles.right}>
             {orgPillText ? (
               <button
                 type="button"
                 style={styles.orgPillButton}
                 onClick={() => setOrgModalOpen(true)}
                 title="Switch organization"
               >
                 {orgPillText}
               </button>
             ) : null}
   
             {showUpgradePill ? (
               <Link href="/settings/billing" style={styles.upgradePill}>
                 Upgrade
               </Link>
             ) : null}
   
             <div ref={rootRef} style={{ position: "relative" }}>
               <button
                 ref={buttonRef}
                 type="button"
                 onClick={() => setOpen((v) => !v)}
                 onKeyDown={onProfileKeyDown}
                 style={styles.profileButton}
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
   
                   <div style={{ padding: 6, display: "grid", gap: 4 }}>
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
                           style={{ ...styles.menuItem, ...(item.disabled ? styles.menuItemDisabled : null) }}
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
           </div>
         </nav>
   
         <SwitchOrgModal open={orgModalOpen} onClose={() => setOrgModalOpen(false)} currentOrgId={currentOrgId} />
       </>
     );
   }
   
   const styles: Record<string, React.CSSProperties> = {
     nav: { display: "flex", alignItems: "center", gap: 12, padding: 12, borderBottom: "1px solid #eee" },
     left: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
     right: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 },
   
     pill: {
       padding: "8px 12px",
       borderRadius: 999,
       border: "1px solid #ddd",
       textDecoration: "none",
       fontSize: 14,
       lineHeight: "16px",
       userSelect: "none",
     },
     pillActive: { fontWeight: 700, background: "rgba(0,0,0,0.04)" },
     pillInactive: { fontWeight: 500, opacity: 0.9 },
   
     orgPillButton: {
       padding: "8px 12px",
       borderRadius: 999,
       border: "1px solid #ddd",
       fontSize: 13,
       fontWeight: 900,
       background: "rgba(0,0,0,0.03)",
       opacity: 0.9,
       whiteSpace: "nowrap",
       maxWidth: 320,
       overflow: "hidden",
       textOverflow: "ellipsis",
       cursor: "pointer",
     },
   
     upgradePill: {
       padding: "8px 12px",
       borderRadius: 999,
       border: "1px solid #ddd",
       textDecoration: "none",
       fontSize: 14,
       fontWeight: 900,
       background: "rgba(0,0,0,0.06)",
     },
   
     profileButton: {
       display: "inline-flex",
       alignItems: "center",
       gap: 8,
       padding: "8px 10px",
       borderRadius: 999,
       border: "1px solid #ddd",
       background: "transparent",
       cursor: "pointer",
     },
     avatar: {
       width: 26,
       height: 26,
       borderRadius: 999,
       border: "1px solid #ddd",
       display: "grid",
       placeItems: "center",
       fontSize: 12,
       fontWeight: 700,
     },
     profileText: {
       maxWidth: 220,
       whiteSpace: "nowrap",
       overflow: "hidden",
       textOverflow: "ellipsis",
       fontSize: 13,
       opacity: 0.9,
     },
     caret: { fontSize: 12, opacity: 0.75 },
   
     menu: {
       position: "absolute",
       top: "calc(100% + 8px)",
       right: 0,
       width: 320,
       borderRadius: 14,
       border: "1px solid #ddd",
       background: "white",
       boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
       overflow: "hidden",
       zIndex: 50,
     },
     menuHeader: { padding: 12 },
     menuLabel: { fontSize: 12, opacity: 0.7, marginBottom: 4 },
     menuEmail: { fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
     menuDivider: { height: 1, background: "#eee" },
     inlineDivider: { height: 1, background: "#eee", margin: "6px 8px" },
     menuItem: {
       width: "100%",
       textAlign: "left",
       padding: "10px 10px",
       borderRadius: 10,
       border: "1px solid transparent",
       background: "transparent",
       cursor: "pointer",
       fontSize: 14,
     },
     menuItemDisabled: { opacity: 0.55, cursor: "not-allowed" },
   };