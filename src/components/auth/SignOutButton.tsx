/* =========================================================
   File: src/components/auth/SignOutButton.tsx
   (If you haven’t created it yet — same as before.)
   ========================================================= */
   "use client";

   import React, { useState } from "react";
   import { useRouter } from "next/navigation";
   import { getSupabaseBrowserClient } from "@/lib/supabase";
   
   type SignOutButtonProps = {
     className?: string;
     style?: React.CSSProperties;
     children?: React.ReactNode;
     redirectTo?: string;
   };
   
   export default function SignOutButton({
     className,
     style,
     children,
     redirectTo = "/auth/login",
   }: SignOutButtonProps) {
     const router = useRouter();
     const [busy, setBusy] = useState(false);
     const [error, setError] = useState<string | null>(null);
   
     async function onSignOut() {
       setBusy(true);
       setError(null);
   
       try {
         const supabase = await getSupabaseBrowserClient();
         const { error: signOutError } = await supabase.auth.signOut();
         if (signOutError) {
           setError(signOutError.message);
           return;
         }
   
         router.push(redirectTo);
         router.refresh();
       } catch (e: unknown) {
         setError(e instanceof Error ? e.message : "Sign out failed.");
       } finally {
         setBusy(false);
       }
     }
   
     return (
       <div style={{ display: "grid", gap: 6 }}>
         <button
           type="button"
           onClick={onSignOut}
           disabled={busy}
           className={className}
           style={{
             padding: 10,
             borderRadius: 10,
             border: "1px solid #ddd",
             cursor: busy ? "not-allowed" : "pointer",
             ...style,
           }}
         >
           {children ?? (busy ? "Signing out..." : "Sign out")}
         </button>
   
         {error ? <div style={{ fontSize: 12, opacity: 0.85 }}>{error}</div> : null}
       </div>
     );
   }