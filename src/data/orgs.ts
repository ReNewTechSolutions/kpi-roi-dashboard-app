import { getSupabaseBrowserClient } from "@/lib/supabase";

export type Organization = {
  id: string;
  name: string;
  created_at: string;
};

export async function listMyOrganizations(): Promise<Organization[]> {
  const supabase = await getSupabaseBrowserClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) throw new Error("Not signed in.");

  const { data, error } = await supabase
    .from("organizations")
    .select("id,name,created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Organization[]) ?? [];
}