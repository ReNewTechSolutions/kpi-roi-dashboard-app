/* =========================================================
   File: src/app/auth/login/LoginForm.tsx
   Update: honor ?next=... and prevent open-redirects.
   ========================================================= */
   "use client";

   import React, { useEffect, useMemo, useState } from "react";
   import Link from "next/link";
   import { useRouter, useSearchParams } from "next/navigation";
   import { getSupabaseBrowserClient } from "@/lib/supabase";
   import {
     AuthButton,
     AuthCard,
     AuthInput,
     AuthStatus,
   } from "@/components/auth/AuthUI";
   
   function sanitizeNext(nextValue: string | null, fallback: string) {
     if (!nextValue) return fallback;
     if (!nextValue.startsWith("/")) return fallback;
     if (nextValue.startsWith("//")) return fallback;
     return nextValue;
   }
   
   export default function LoginForm() {
     const router = useRouter();
     const searchParams = useSearchParams();
   
     const nextTarget = useMemo(() => {
       return sanitizeNext(searchParams.get("next"), "/dashboard");
     }, [searchParams]);
   
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
   
     const [status, setStatus] = useState<string | null>(null);
     const [busy, setBusy] = useState(false);
   
     useEffect(() => {
       let alive = true;
   
       (async () => {
         try {
           const supabase = await getSupabaseBrowserClient();
           const { data } = await supabase.auth.getSession();
           if (!alive) return;
           if (data.session) router.replace(nextTarget);
         } catch {
           // ignore
         }
       })();
   
       return () => {
         alive = false;
       };
     }, [router, nextTarget]);
   
     async function signIn() {
       setStatus(null);
       setBusy(true);
   
       try {
         const supabase = await getSupabaseBrowserClient();
         const { error } = await supabase.auth.signInWithPassword({
           email: email.trim(),
           password,
         });
   
         if (error) {
           setStatus(error.message);
           return;
         }
   
         router.push(nextTarget);
         router.refresh();
       } catch (e: unknown) {
         setStatus(e instanceof Error ? e.message : "Login failed.");
       } finally {
         setBusy(false);
       }
     }
   
     return (
       <AuthCard title="Login">
         <div style={{ display: "grid", gap: 10 }}>
           <AuthInput
             placeholder="Email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             autoComplete="email"
             inputMode="email"
           />
           <AuthInput
             placeholder="Password"
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             autoComplete="current-password"
           />
   
           <AuthButton
             onClick={signIn}
             disabled={busy || !email.trim() || !password}
           >
             {busy ? "Signing in..." : "Sign in"}
           </AuthButton>
   
           <AuthStatus message={status} />
   
           <div style={{ fontSize: 13, opacity: 0.75 }}>
             No account?{" "}
             <Link href={`/auth/signup?next=${encodeURIComponent(nextTarget)}`}>
               Create one
             </Link>
             <Link href="/legal/privacy">Privacy (Org view)</Link>
           </div>
         </div>
       </AuthCard>
     );
   }