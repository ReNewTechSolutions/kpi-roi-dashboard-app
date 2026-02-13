import { supabase } from "./supabase.client";

export async function getSession() {
  return supabase.auth.getSession();
}

export async function signOut() {
  return supabase.auth.signOut();
}