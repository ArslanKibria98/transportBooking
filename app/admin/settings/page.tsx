"use client";

import { useEffect, useState } from "react";

interface VehicleRow {
  vehicle: string;
  percent: number;
  enabled: boolean;
}

function Toggle({ on, onClick, disabled }: { on: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={on}
      style={{
        position: "relative", width: 46, height: 26, borderRadius: 999, border: "none",
        cursor: disabled ? "not-allowed" : "pointer", flexShrink: 0,
        background: on ? "#16a34a" : "#cbd5e1", transition: "background 0.2s", opacity: disabled ? 0.5 : 1,
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: on ? 23 : 3, width: 20, height: 20, borderRadius: "50%",
        background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

export default function AdminSettingsPage() {
  const [name, setName] = useState("Driver Gratuity");
  const [enabled, setEnabled] = useState(true);
  const [defaultPercent, setDefaultPercent] = useState(15);
  const [rows, setRows] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sRes, vRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/vehicles"),
      ]);
      if (!sRes.ok) throw new Error("Failed to load settings");
      const s = await sRes.json();
      const vData = vRes.ok ? await vRes.json() : { items: [] };
      const vehicleNames: string[] = (vData.items || []).map((v: any) => v.name);
      const overrides: VehicleRow[] = Array.isArray(s.vehicleCharges) ? s.vehicleCharges : [];
      const dft = s.extraChargePercent ?? 15;

      setName(s.extraChargeName ?? "Driver Gratuity");
      setEnabled(s.extraChargeEnabled ?? true);
      setDefaultPercent(dft);
      setRows(
        vehicleNames.map((vn) => {
          const o = overrides.find((x) => x.vehicle === vn);
          return o
            ? { vehicle: vn, percent: o.percent, enabled: o.enabled }
            : { vehicle: vn, percent: dft, enabled: true };
        })
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateRow = (vehicle: string, patch: Partial<VehicleRow>) => {
    setRows((prev) => prev.map((r) => (r.vehicle === vehicle ? { ...r, ...patch } : r)));
  };

  const applyDefaultToAll = () => {
    setRows((prev) => prev.map((r) => ({ ...r, percent: defaultPercent, enabled: true })));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extraChargeName: name,
          extraChargeEnabled: enabled,
          extraChargePercent: defaultPercent,
          vehicleCharges: rows,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setSuccess("Settings saved. Changes are now live across the site.");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.55rem 0.7rem",
    background: "#ffffff", border: "1px solid #d1d5db",
    borderRadius: 6, color: "#1e293b", fontSize: 14, outline: "none",
  };

  return (
    <div style={{ maxWidth: 820 }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 2 }}>Pricing Settings</h1>
        <p style={{ fontSize: 13, color: "#64748b" }}>
          An extra charge added on top of every rate (Fuel 5% · HST 13% · Gratuity 15%). Set a
          different percentage per vehicle, or turn it off for specific vehicles. Applies to the
          calculator, vehicle &amp; service pages, and the final checkout price.
        </p>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", color: "#dc2626", padding: "0.75rem 1rem", borderRadius: 6, marginBottom: "1rem", fontSize: 14, border: "1px solid #fecaca" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: "#f0fdf4", color: "#16a34a", padding: "0.75rem 1rem", borderRadius: 6, marginBottom: "1rem", fontSize: 14, border: "1px solid #bbf7d0" }}>
          {success}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>Loading settings…</div>
      ) : (
        <form onSubmit={handleSave} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "1.75rem" }}>
          {/* Master toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem 1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, marginBottom: "1.5rem" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>Apply this charge</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                {enabled ? "ON — added per the per-vehicle rates below." : "OFF — not applied anywhere, on any vehicle."}
              </div>
            </div>
            <Toggle on={enabled} onClick={() => setEnabled(!enabled)} />
          </div>

          {/* Name + default percent */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1.5rem", opacity: enabled ? 1 : 0.55 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Charge Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Driver Gratuity"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Default % (new vehicles)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={defaultPercent}
                onChange={(e) => setDefaultPercent(Number(e.target.value))}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Per-vehicle table */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>Charge per Vehicle</h2>
            <button type="button" onClick={applyDefaultToAll}
              style={{ padding: "0.35rem 0.85rem", background: "#f1f5f9", color: "#1e293b", border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
              Set all to {defaultPercent}%
            </button>
          </div>

          {rows.length === 0 ? (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "#94a3b8", fontSize: 14, border: "1px dashed #e2e8f0", borderRadius: 8, marginBottom: "1.5rem" }}>
              No vehicles found. Add vehicles first, then configure their charges here.
            </div>
          ) : (
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden", marginBottom: "1.5rem", opacity: enabled ? 1 : 0.55 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ textAlign: "left", padding: "0.6rem 1rem", color: "#64748b", fontWeight: 500, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Vehicle</th>
                    <th style={{ textAlign: "center", padding: "0.6rem 1rem", color: "#64748b", fontWeight: 500, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, width: 140 }}>Percent (%)</th>
                    <th style={{ textAlign: "center", padding: "0.6rem 1rem", color: "#64748b", fontWeight: 500, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, width: 110 }}>Apply</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.vehicle} style={{ borderBottom: "1px solid #e2e8f0", background: i % 2 === 0 ? "transparent" : "#f8fafc" }}>
                      <td style={{ padding: "0.6rem 1rem", color: "#1e293b", fontWeight: 500 }}>{r.vehicle}</td>
                      <td style={{ padding: "0.5rem 1rem", textAlign: "center" }}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={r.percent}
                          disabled={!enabled || !r.enabled}
                          onChange={(e) => updateRow(r.vehicle, { percent: Number(e.target.value) })}
                          style={{ ...inputStyle, width: 90, textAlign: "center", padding: "0.4rem 0.5rem", opacity: r.enabled ? 1 : 0.5 }}
                        />
                      </td>
                      <td style={{ padding: "0.5rem 1rem" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <Toggle on={r.enabled} disabled={!enabled} onClick={() => updateRow(r.vehicle, { enabled: !r.enabled })} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button type="submit" disabled={saving}
            style={{ padding: "0.65rem 1.6rem", background: saving ? "#e2e8f0" : "#D4AF37", color: saving ? "#94a3b8" : "#000", border: "none", borderRadius: 6, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontSize: 14 }}>
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </form>
      )}

      <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12, color: "#64748b", lineHeight: 1.8 }}>
        <strong style={{ color: "#D4AF37" }}>Note:</strong> The fixed Fuel (5%), HST (13%) and Gratuity (15%) charges are always applied.
        This adds one more charge on top — set it per vehicle, turn it off for any vehicle, or flip the master switch to remove it everywhere.
      </div>
    </div>
  );
}
