import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Settings } from "@/models/Settings";

const serialize = (doc: any) => ({
  extraChargeName: doc.extraChargeName,
  extraChargeEnabled: doc.extraChargeEnabled,
  extraChargePercent: doc.extraChargePercent,
  vehicleCharges: Array.isArray(doc.vehicleCharges)
    ? doc.vehicleCharges.map((v: any) => ({
        vehicle: v.vehicle,
        percent: v.percent,
        enabled: v.enabled,
      }))
    : [],
});

// GET /api/admin/settings — current extra-charge config
export async function GET() {
  await dbConnect();
  let doc = await (Settings as any).findOne({ key: "global" }).lean();
  if (!doc) {
    await (Settings as any).create({ key: "global" });
    doc = await (Settings as any).findOne({ key: "global" }).lean();
  }
  return NextResponse.json(serialize(doc));
}

// PUT /api/admin/settings — update name / master toggle / default % / per-vehicle overrides
export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  await dbConnect();

  const update: Record<string, unknown> = {};

  if (body.extraChargeName !== undefined) {
    const name = String(body.extraChargeName).trim();
    if (!name) {
      return NextResponse.json({ error: "Charge name cannot be empty" }, { status: 400 });
    }
    update.extraChargeName = name;
  }

  if (body.extraChargeEnabled !== undefined) {
    update.extraChargeEnabled = Boolean(body.extraChargeEnabled);
  }

  if (body.extraChargePercent !== undefined) {
    const pct = Number(body.extraChargePercent);
    if (Number.isNaN(pct) || pct < 0 || pct > 100) {
      return NextResponse.json({ error: "Default percent must be between 0 and 100" }, { status: 400 });
    }
    update.extraChargePercent = pct;
  }

  if (body.vehicleCharges !== undefined) {
    if (!Array.isArray(body.vehicleCharges)) {
      return NextResponse.json({ error: "vehicleCharges must be an array" }, { status: 400 });
    }
    const cleaned = [];
    for (const v of body.vehicleCharges) {
      const vehicle = String(v?.vehicle ?? "").trim();
      if (!vehicle) continue;
      const pct = Number(v?.percent);
      if (Number.isNaN(pct) || pct < 0 || pct > 100) {
        return NextResponse.json(
          { error: `Invalid percent for "${vehicle}" (must be 0–100)` },
          { status: 400 }
        );
      }
      cleaned.push({ vehicle, percent: pct, enabled: Boolean(v?.enabled) });
    }
    update.vehicleCharges = cleaned;
  }

  const doc = await (Settings as any)
    .findOneAndUpdate({ key: "global" }, { $set: update }, { new: true, upsert: true })
    .lean();

  return NextResponse.json(serialize(doc));
}
