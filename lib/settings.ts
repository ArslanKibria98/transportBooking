import { dbConnect } from "@/lib/mongodb";
import { Settings } from "@/models/Settings";

export interface ExtraChargeConfig {
  name: string;
  percent: number;
  enabled: boolean;
}

export const DEFAULT_EXTRA_CHARGE: ExtraChargeConfig = {
  name: "Driver Gratuity",
  percent: 15,
  enabled: true,
};

// Fixed surcharges already baked into every rate.
export const FUEL_PCT = 0.05;
export const HST_PCT = 0.13;
export const GRATUITY_PCT = 0.15;
export const BASE_MULTIPLIER = 1 + FUEL_PCT + HST_PCT + GRATUITY_PCT; // 1.33

/**
 * Returns the admin-configured extra charge. Creates the singleton settings
 * document with defaults the first time it's requested.
 */
export async function getExtraCharge(): Promise<ExtraChargeConfig> {
  await dbConnect();
  let doc = await (Settings as any).findOne({ key: "global" }).lean();
  if (!doc) {
    await (Settings as any).create({ key: "global" });
    doc = await (Settings as any).findOne({ key: "global" }).lean();
  }
  return {
    name: doc?.extraChargeName ?? DEFAULT_EXTRA_CHARGE.name,
    percent: typeof doc?.extraChargePercent === "number" ? doc.extraChargePercent : DEFAULT_EXTRA_CHARGE.percent,
    enabled: doc?.extraChargeEnabled ?? DEFAULT_EXTRA_CHARGE.enabled,
  };
}

/** Total multiplier including the extra charge when enabled. */
export function totalMultiplier(extra: ExtraChargeConfig): number {
  return BASE_MULTIPLIER + (extra.enabled ? extra.percent / 100 : 0);
}
