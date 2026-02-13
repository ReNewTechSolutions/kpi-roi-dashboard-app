"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/Card";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { getCachedOrgId, setCachedOrgId, clearCachedOrgId } from "@/lib/storage";
import { addOwnerMembership, createOrg, fetchOrgs, renameOrg, type Org } from "@/lib/org";
import { getErrorMessage } from "@/lib/errors";

export default function OrgPage() {
  const r = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [orgs, setOrgs] = useState<Org[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [newOrgName, setNewOrgName] = useState("");
  const [rename, setRename] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      setStatus(null);
      setBusy(true);

      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        r.push("/auth/login");
        return;
      }

      const list = await fetchOrgs(supabase);
      setOrgs(list);

      const cached = getCachedOrgId();
      const initial =
        cached && list.some((o) => o.id === cached) ? cached : list[0]?.id ?? null;

      setSelected(initial);

      if (initial) {
        setCachedOrgId(initial);
        const chosen = list.find((o) => o.id === initial);
        if (chosen) setRename(chosen.name);
      } else {
        setRename("");
      }
    } catch (err: unknown) {
      setStatus(getErrorMessage(err));
      setOrgs([]);
      setSelected(null);
      setRename("");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectOrg = (o: Org) => {
    setSelected(o.id);
    setCachedOrgId(o.id);
    setRename(o.name);
    setStatus(`Selected: ${o.name}`);
  };

  const create = async () => {
    try {
      setStatus(null);
      setBusy(true);

      const { data: sess } = await supabase.auth.getSession();
      const userId = sess.session?.user.id;
      if (!userId) {
        setStatus("Not signed in.");
        return;
      }

      const name = newOrgName.trim();
      if (!name) {
        setStatus("Enter an organization name.");
        return;
      }

      const created = await createOrg(supabase, name, userId);
      await addOwnerMembership(supabase, created.id, userId);

      setNewOrgName("");
      await load();
      selectOrg(created);
    } catch (err: unknown) {
      setStatus(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const doRename = async () => {
    try {
      setStatus(null);
      setBusy(true);

      if (!selected) {
        setStatus("Select an org first.");
        return;
      }

      const name = rename.trim();
      if (!name) {
        setStatus("Enter a new name.");
        return;
      }

      await renameOrg(supabase, selected, name);
      await load();
      setStatus("Updated organization name.");
    } catch (err: unknown) {
      setStatus(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const clear = () => {
    setSelected(null);
    setRename("");
    clearCachedOrgId();
    setStatus("Selection cleared.");
  };

  return (
    <main style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Organizations</h2>
        <button onClick={load} style={btn} disabled={busy}>
          {busy ? "Loading…" : "Refresh"}
        </button>
      </div>

      {status ? <Card>{status}</Card> : null}

      <div style={{ display: "grid", gap: 10 }}>
        {orgs.length === 0 ? (
          <Card>
            <div style={{ fontWeight: 800 }}>No organizations yet</div>
            <div style={{ opacity: 0.75, marginTop: 6 }}>Create your first org below.</div>
          </Card>
        ) : (
          orgs.map((o) => (
            <Card key={o.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                <div style={{ fontWeight: 800 }}>{o.name}</div>
                <button onClick={() => selectOrg(o)} style={btn} disabled={busy}>
                  {selected === o.id ? "Selected" : "Select"}
                </button>
              </div>
              <div style={{ fontSize: 12, opacity: 0.65, marginTop: 6 }}>{o.id}</div>
            </Card>
          ))
        )}
      </div>

      <Card>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Create new org</div>
        <input
          value={newOrgName}
          onChange={(e) => setNewOrgName(e.target.value)}
          placeholder="Org name"
          style={inp}
        />
        <div style={{ height: 10 }} />
        <button onClick={create} style={btn} disabled={busy}>
          Create
        </button>
      </Card>

      <Card>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Rename selected org</div>
        <input
          value={rename}
          onChange={(e) => setRename(e.target.value)}
          placeholder="New org name"
          style={inp}
          disabled={!selected}
        />
        <div style={{ height: 10 }} />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={doRename} style={btn} disabled={busy || !selected}>
            Rename
          </button>
          <button onClick={clear} style={btn} disabled={busy}>
            Clear Selection
          </button>
        </div>
      </Card>
    </main>
  );
}

const inp: React.CSSProperties = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
  width: "100%",
};

const btn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  cursor: "pointer",
};