import mongoose, { Schema } from "mongoose";

export interface VehicleChargeDoc {
  vehicle: string;
  percent: number;
  enabled: boolean;
}

export interface SettingsDoc {
  _id: string;
  key: string;
  // Admin-configurable extra charge (added on top of Fuel 5% + HST 13% + Gratuity 15%)
  extraChargeName: string;
  extraChargeEnabled: boolean;   // master switch
  extraChargePercent: number;    // default % for vehicles without an override
  vehicleCharges: VehicleChargeDoc[]; // per-vehicle overrides
  createdAt: Date;
  updatedAt: Date;
}

const VehicleChargeSchema = new Schema<VehicleChargeDoc>(
  {
    vehicle: { type: String, required: true, trim: true },
    percent: { type: Number, required: true, default: 15 },
    enabled: { type: Boolean, required: true, default: true },
  },
  { _id: false }
);

const SettingsSchema = new Schema<SettingsDoc>(
  {
    key:                { type: String, required: true, unique: true, default: "global" },
    extraChargeName:    { type: String, required: true, trim: true, default: "Driver Gratuity" },
    extraChargeEnabled: { type: Boolean, required: true, default: true },
    extraChargePercent: { type: Number, required: true, default: 15 },
    vehicleCharges:     { type: [VehicleChargeSchema], default: [] },
  },
  { timestamps: true }
);

export const Settings =
  (mongoose.models.Settings as mongoose.Model<any>) ||
  mongoose.model<SettingsDoc>("Settings", SettingsSchema);
