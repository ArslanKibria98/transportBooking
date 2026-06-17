import { NextResponse } from "next/server";
import { getExtraChargeConfig } from "@/lib/settings";
import { DEFAULT_CONFIG } from "@/lib/extraChargeResolve";

// Public endpoint — read-only. Used by the rate calculators on the
// storefront (calculator, vehicle pages, service pages) so the displayed
// total matches the price charged at checkout. The client resolves the
// charge per selected vehicle using resolveExtraCharge().
export async function GET() {
  try {
    const config = await getExtraChargeConfig();
    return NextResponse.json(config);
  } catch {
    // If the DB is unreachable, fall back to NOT applying anything so
    // customers are never shown a surprise fee.
    return NextResponse.json({ ...DEFAULT_CONFIG, enabled: false });
  }
}
