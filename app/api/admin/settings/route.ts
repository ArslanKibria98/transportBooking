import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Settings } from "@/models/Settings";

const serialize = (doc: any) => ({
  extraChargeName: doc.extraChargeName,
  extraChargePercent: doc.extraChargePercent,
  extraChargeEnabled: doc.extraChargeEnabled,
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

// PUT /api/admin/settings — update extra-charge name / percent / enabled
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

  if (body.extraChargePercent !== undefined) {
    const pct = Number(body.extraChargePercent);
    if (Number.isNaN(pct) || pct < 0 || pct > 100) {
      return NextResponse.json({ error: "Percent must be between 0 and 100" }, { status: 400 });
    }
    update.extraChargePercent = pct;
  }

  if (body.extraChargeEnabled !== undefined) {
    update.extraChargeEnabled = Boolean(body.extraChargeEnabled);
  }

  const doc = await (Settings as any)
    .findOneAndUpdate({ key: "global" }, { $set: update }, { new: true, upsert: true })
    .lean();

  return NextResponse.json(serialize(doc));
}
