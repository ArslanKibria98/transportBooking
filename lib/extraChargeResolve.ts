// Pure helpers (no DB / no server-only imports) so they can be used in both
// client components and API routes.

export interface VehicleCharge {
  vehicle: string; // matches VehiclePreference.name / Rate.carType
  percent: number;
  enabled: boolean;
}

export interface ExtraChargeConfig {
  name: string;            // global charge name e.g. "Driver Gratuity"
  enabled: boolean;        // master switch — off = nothing applied anywhere
  defaultPercent: number;  // used for vehicles without an explicit override
  vehicleCharges: VehicleCharge[];
}

export interface ResolvedCharge {
  name: string;
  percent: number;
  enabled: boolean;
}

export const DEFAULT_CONFIG: ExtraChargeConfig = {
  name: "Driver Gratuity",
  enabled: true,
  defaultPercent: 15,
  vehicleCharges: [],
};

// Fixed surcharges baked into every rate.
export const BASE_MULTIPLIER = 1 + 0.05 + 0.13 + 0.15; // 1.33

/**
 * Resolve the extra charge for a specific vehicle.
 * - Master off → nothing.
 * - Vehicle has an explicit override → use it (may itself be disabled = "none").
 * - Otherwise → fall back to the default percent (enabled).
 */
export function resolveExtraCharge(
  cfg: ExtraChargeConfig,
  vehicleName: string
): ResolvedCharge {
  if (!cfg.enabled) return { name: cfg.name, percent: 0, enabled: false };
  const override = cfg.vehicleCharges.find(
    (v) => v.vehicle.trim().toLowerCase() === (vehicleName || "").trim().toLowerCase()
  );
  if (override) {
    return { name: cfg.name, percent: override.percent, enabled: override.enabled };
  }
  return { name: cfg.name, percent: cfg.defaultPercent, enabled: true };
}

/** Multiplier (incl. base surcharges) for a vehicle's resolved charge. */
export function totalMultiplierFor(cfg: ExtraChargeConfig, vehicleName: string): number {
  const r = resolveExtraCharge(cfg, vehicleName);
  return BASE_MULTIPLIER + (r.enabled ? r.percent / 100 : 0);
}
