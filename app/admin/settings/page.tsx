"use client";

import { useEffect, useState } from "react";

interface SettingsForm {
  extraChargeName: string;
  extraChargePercent: number;
  extraChargeEnabled: boolean;
}

const defaultForm: SettingsForm = {
  extraChargeName: "Driver Gratuity",
  extraChargePercent: 15,
  extraChargeEnabled: true,
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to load settings");
      const data = await res.json();
      setForm({
        extraChargeName: data.extraChargeName ?? defaultForm.extraChargeName,
        extraChargePercent: data.extraChargePercent ?? defaultForm.extraChargePercent,
        extraChargeEnabled: data.extraChargeEnabled ?? defaultForm.extraChargeEnabled,
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setForm({
        extraChargeName: data.extraChargeName,
        extraChargePercent: data.extraChargePercent,
        extraChargeEnabled: data.extraChargeEnabled,
      });
      setSuccess("Settings saved. Changes are now live across the site.");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.6rem 0.75rem",
    background: "#ffffff", border: "1px solid #d1d5db",
    borderRadius: 6, color: "#1e293b", fontSize: 14, outline: "none",
  };

  // Preview on a sample CA$100 base rate
  const sampleBase = 100;
  const sampleExtra = form.extraChargeEnabled ? sampleBase * (form.extraChargePercent / 100) : 0;
  const sampleTotal = sampleBase + sampleBase * 0.05 + sampleBase * 0.13 + sampleBase * 0.15 + sampleExtra;

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 2 }}>Pricing Settings</h1>
        <p style={{ fontSize: 13, color: "#64748b" }}>
          Configure an additional charge applied on top of every rate. When enabled, it is added to
          the calculator, vehicle &amp; service pages, and the final checkout price.
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
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: "1.25rem", color: "#1e293b" }}>
            Additional Charge
          </h2>

          {/* Enable toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem 1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, marginBottom: "1.5rem" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>Apply this charge</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                {form.extraChargeEnabled ? "Currently added to every total." : "Currently OFF — not applied anywhere."}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, extraChargeEnabled: !form.extraChargeEnabled })}
              aria-pressed={form.extraChargeEnabled}
              style={{
                position: "relative", width: 52, height: 28, borderRadius: 999, border: "none", cursor: "pointer",
                background: form.extraChargeEnabled ? "#16a34a" : "#cbd5e1", transition: "background 0.2s", flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute", top: 3, left: form.extraChargeEnabled ? 27 : 3,
                width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1.5rem", opacity: form.extraChargeEnabled ? 1 : 0.55 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Charge Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Driver Gratuity"
                value={form.extraChargeName}
                onChange={(e) => setForm({ ...form, extraChargeName: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Percent (%) *
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                step="0.01"
                value={form.extraChargePercent}
                onChange={(e) => setForm({ ...form, extraChargePercent: Number(e.target.value) })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Live preview */}
          <div style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: "0.85rem 1rem", marginBottom: "1.5rem", fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>
            <strong style={{ color: "#D4AF37" }}>Preview</strong> (on a CA$100 base rate):<br />
            Base CA$100.00 · Fuel 5% CA$5.00 · HST 13% CA$13.00 · Gratuity 15% CA$15.00
            {form.extraChargeEnabled && (
              <> · <strong style={{ color: "#1e293b" }}>{form.extraChargeName || "Extra"} {form.extraChargePercent}% CA${sampleExtra.toFixed(2)}</strong></>
            )}
            {" "}· <strong style={{ color: "#16a34a" }}>Total CA${sampleTotal.toFixed(2)}</strong>
          </div>

          <button type="submit" disabled={saving}
            style={{ padding: "0.65rem 1.6rem", background: saving ? "#e2e8f0" : "#D4AF37", color: saving ? "#94a3b8" : "#000", border: "none", borderRadius: 6, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontSize: 14 }}>
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </form>
      )}

      <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12, color: "#64748b", lineHeight: 1.8 }}>
        <strong style={{ color: "#D4AF37" }}>Note:</strong> The fixed Fuel (5%), HST (13%) and Gratuity (15%) charges are always applied.
        This setting adds one more configurable charge on top — toggle it off any time to remove it everywhere.
      </div>
    </div>
  );
}
