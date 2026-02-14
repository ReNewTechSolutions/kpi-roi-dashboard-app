/* =========================================================
   File: src/lib/serverCookies.ts
   Tiny helper:
   - One-liners for get/set/delete cookies in Server Components/routes/actions
   ========================================================= */
   import "server-only";

   import { cookies } from "next/headers";
   
   export type CookieSetOptions = {
     httpOnly?: boolean;
     sameSite?: "lax" | "strict" | "none";
     secure?: boolean;
     path?: string;
     maxAge?: number;
   };
   
   export async function getCookie(name: string): Promise<string | null> {
     const store = await cookies();
     return store.get(name)?.value ?? null;
   }
   
   export async function setCookie(name: string, value: string, options?: CookieSetOptions): Promise<void> {
     const store = await cookies();
     store.set(name, value, {
       httpOnly: options?.httpOnly ?? true,
       sameSite: options?.sameSite ?? "lax",
       secure: options?.secure ?? process.env.NODE_ENV === "production",
       path: options?.path ?? "/",
       maxAge: options?.maxAge,
     });
   }
   
   export async function deleteCookie(name: string): Promise<void> {
     const store = await cookies();
     store.set(name, "", {
       httpOnly: true,
       sameSite: "lax",
       secure: process.env.NODE_ENV === "production",
       path: "/",
       maxAge: 0,
     });
   }