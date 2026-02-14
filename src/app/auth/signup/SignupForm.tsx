/* =========================================================
   File: src/app/auth/signup/SignupForm.tsx
   Update: preserve ?next=... and send to login with next.
   ========================================================= */
   "use client";

   import React, { useMemo, useState } from "react";
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
   
   export default function SignupForm() {
     const router = useRouter();
     const searchParams = useSearchParams();
   
     const nextTarget = useMemo(() => {
       return sanitizeNext(searchParams.get("next"), "/dashboard");
     }, [searchParams]);
   
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
   
     const [status, setStatus] = useState<string | null>(null);
     const [busy, setBusy] = useState(false);
   
     async function signUp() {
       setStatus(null);
       setBusy(true);
   
       try {
         const supabase = getSupabaseBrowserClient();
         const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
         });
   
         if (error) {
           setStatus(error.message);
           return;
         }
   
         setStatus("Account created. Check your email if confirmation is required.");
         router.push(`/auth/login?next=${encodeURIComponent(nextTarget)}`);
         router.refresh();
       } catch (e: unknown) {
         setStatus(e instanceof Error ? e.message : "Signup failed.");
       } finally {
         setBusy(false);
       }
     }
   
     return (
       <AuthCard title="Create account">
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
             autoComplete="new-password"
           />
   
           <AuthButton
             onClick={signUp}
             disabled={busy || !email.trim() || !password}
           >
             {busy ? "Creating..." : "Sign up"}
           </AuthButton>
   
           <AuthStatus message={status} />
   
           <div style={{ fontSize: 13, opacity: 0.75 }}>
             Have an account?{" "}
             <Link href={`/auth/login?next=${encodeURIComponent(nextTarget)}`}>
               Sign in
             </Link>
           </div>
         </div>
       </AuthCard>
     );
   }