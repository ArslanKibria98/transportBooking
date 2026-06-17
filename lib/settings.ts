import { dbConnect } from "@/lib/mongodb";
import { Settings } from "@/models/Settings";
import {
  ExtraChargeConfig,
  DEFAULT_CONFIG,
  BASE_MULTIPLIER,
  resolveExtraCharge,
  totalMultiplierFor,
} from "@/lib/extraChargeResolve";

export type { ExtraChargeConfig };
export { BASE_MULTIPLIER, resolveExtraCharge, totalMultiplierFor, DEFAULT_CONFIG };

/**
 * Returns the full admin-configured extra charge config. Creates the singleton
 * settings document with defaults the first time it's requested.
 */
export async function getExtraChargeConfig(): Promise<ExtraChargeConfig> {
  await dbConnect();
  let doc = await (Settings as any).findOne({ key: "global" }).lean();
  if (!doc) {
    await (Settings as any).create({ key: "global" });
    doc = await (Settings as any).findOne({ key: "global" }).lean();
  }
  return {
    name: doc?.extraChargeName ?? DEFAULT_CONFIG.name,
    enabled: doc?.extraChargeEnabled ?? DEFAULT_CONFIG.enabled,
    defaultPercent:
      typeof doc?.extraChargePercent === "number" ? doc.extraChargePercent : DEFAULT_CONFIG.defaultPercent,
    vehicleCharges: Array.isArray(doc?.vehicleCharges)
      ? doc.vehicleCharges.map((v: any) => ({
          vehicle: v.vehicle,
          percent: Number(v.percent) || 0,
          enabled: Boolean(v.enabled),
        }))
      : [],
  };
}
