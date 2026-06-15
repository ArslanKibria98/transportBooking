import { NextResponse } from "next/server";
import { getExtraCharge, DEFAULT_EXTRA_CHARGE } from "@/lib/settings";

// Public endpoint — read-only. Used by the rate calculators on the
// storefront (calculator, vehicle pages, service pages) so the displayed
// total matches the price charged at checkout.
export async function GET() {
  try {
    const extraCharge = await getExtraCharge();
    return NextResponse.json({ extraCharge });
  } catch {
    // If the DB is unreachable, fall back to NOT applying the extra charge
    // so customers are never shown a surprise fee.
    return NextResponse.json({
      extraCharge: { ...DEFAULT_EXTRA_CHARGE, enabled: false },
    });
  }
}
