import mongoose, { Schema } from "mongoose";

export interface SettingsDoc {
  _id: string;
  key: string;
  // Admin-configurable extra charge (added on top of Fuel 5% + HST 13% + Gratuity 15%)
  extraChargeName: string;
  extraChargePercent: number;
  extraChargeEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<SettingsDoc>(
  {
    key:                { type: String, required: true, unique: true, default: "global" },
    extraChargeName:    { type: String, required: true, trim: true, default: "Driver Gratuity" },
    extraChargePercent: { type: Number, required: true, default: 15 },
    extraChargeEnabled: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

export const Settings =
  (mongoose.models.Settings as mongoose.Model<any>) ||
  mongoose.model<SettingsDoc>("Settings", SettingsSchema);
