/**
 * Seed Toronto Airport Limo rates — city × airport × vehicle base rates
 * scraped from torontoairportlimo.com/rates.aspx.
 *
 * Data source: scripts/torontoAirportRates.json
 *   { destination, airport (code), carType (vehicle name), tariff (base rate, pre-surcharge) }
 *
 * Full replace: wipes the Rate, Airport and VehiclePreference collections and
 * re-inserts the 6 airports (YYZ/YTZ/BUF rated; YZD/YHM/IAG contact-only),
 * the 9 source vehicles, and the full scraped rate matrix. Safe to re-run.
 *
 * Run:  node scripts/seedAirportRates.mjs   (or: npm run db:seed:rates)
 */
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loadEnvFile = (filename) => {
  try {
    const content = readFileSync(join(__dirname, "..", filename), "utf-8");
    content.split("\n").forEach((line) => {
      const t = line.trim();
      if (t && !t.startsWith("#")) {
        const [key, ...vals] = t.split("=");
        if (key && vals.length && !process.env[key.trim()]) {
          process.env[key.trim()] = vals.join("=").trim().replace(/^["']|["']$/g, "");
        }
      }
    });
  } catch {}
};
loadEnvFile(".env.local");
loadEnvFile(".env");

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/transportbooking";
const dbName = process.env.MONGODB_DB || "transportbooking";

// All airports offered. YYZ / YTZ / BUF have a full rate matrix; YZD / YHM / IAG
// are "contact us" only on the source site (no published rates) but are still
// listed so users can select them and see the Contact Us prompt.
const AIRPORTS = [
  { code: "YYZ", name: "Toronto Pearson International Airport" },
  { code: "YTZ", name: "Billy Bishop Toronto City Airport" },
  { code: "BUF", name: "Buffalo Niagara International Airport" },
  { code: "YZD", name: "Downsview Airport" },
  { code: "YHM", name: "John C. Munro Hamilton International Airport" },
  { code: "IAG", name: "Niagara Falls International Airport" },
];

// Category-appropriate vehicle images (Unsplash, same source style as the app's
// existing fix-vehicle-images script).
const IMG = {
  sedan: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop",
  suv: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop",
  van: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?q=80&w=2070&auto=format&fit=crop",
  limo: "https://images.unsplash.com/photo-1511210352396-54a060633c32?q=80&w=2114&auto=format&fit=crop",
};

// The 9 vehicle types from the source site (carType in the rates matches `name`).
const VEHICLES = [
  { name: "Sedan", category: "Sedan", passengers: 4, luggage: 3, image: IMG.sedan },
  { name: "Mercedes Sedan", category: "Sedan", passengers: 4, luggage: 3, image: IMG.sedan },
  { name: "BMW 750Li", category: "Luxury Sedan", passengers: 3, luggage: 3, image: IMG.sedan },
  { name: "SUV", category: "SUV", passengers: 6, luggage: 5, image: IMG.suv },
  { name: "Premium SUV", category: "SUV", passengers: 6, luggage: 5, image: IMG.suv },
  { name: "Sprinter Executive Van", category: "Van", passengers: 10, luggage: 10, image: IMG.van },
  { name: "Stretch Limo", category: "Limo", passengers: 6, luggage: 4, image: IMG.limo },
  { name: "SUV Stretch Limo", category: "Limo", passengers: 10, luggage: 6, image: IMG.limo },
  { name: "SUV Stretch Limo XL", category: "Limo", passengers: 10, luggage: 6, image: IMG.limo },
];

const RateSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true, trim: true },
    tariff: { type: Number, required: true },
    carType: { type: String, required: true, trim: true },
    airport: { type: String, required: true, trim: true, default: "YYZ" },
  },
  { timestamps: true }
);
const AirportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
  },
  { timestamps: true }
);
const VehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: { type: String, trim: true },
    image: { type: String, trim: true },
    passengers: { type: Number, default: 0 },
    luggage: { type: Number, default: 0 },
    description: { type: String, trim: true },
    rate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

async function main() {
  const rates = JSON.parse(
    readFileSync(join(__dirname, "torontoAirportRates.json"), "utf-8")
  );
  console.log(`Loaded ${rates.length} rates from torontoAirportRates.json`);

  await mongoose.connect(uri, { dbName });
  const Rate = mongoose.models.Rate || mongoose.model("Rate", RateSchema);
  const Airport = mongoose.models.Airport || mongoose.model("Airport", AirportSchema);
  const VehiclePreference =
    mongoose.models.VehiclePreference || mongoose.model("VehiclePreference", VehicleSchema);

  // Replace airports — wipe old, insert the 3 that have rates.
  const delAir = (await Airport.deleteMany({})).deletedCount;
  await Airport.insertMany(AIRPORTS);
  console.log(`Airports: removed ${delAir}, inserted ${AIRPORTS.length} (${AIRPORTS.map((a) => a.code).join(", ")})`);

  // Replace vehicles — wipe old, insert the 9 source vehicles.
  const delVeh = (await VehiclePreference.deleteMany({})).deletedCount;
  await VehiclePreference.insertMany(VEHICLES);
  console.log(`Vehicles: removed ${delVeh}, inserted ${VEHICLES.length}`);

  // Rates — always replace per request (remove old, insert scraped matrix).
  const delRate = (await Rate.deleteMany({})).deletedCount;
  console.log(`Rates: removed ${delRate} existing`);

  const ops = rates.map((r) => ({
    updateOne: {
      filter: { destination: r.destination, airport: r.airport, carType: r.carType },
      update: { $set: { tariff: r.tariff } },
      upsert: true,
    },
  }));

  // Chunked bulkWrite to stay well within limits
  let upserted = 0,
    modified = 0;
  const CHUNK = 1000;
  for (let i = 0; i < ops.length; i += CHUNK) {
    const res = await Rate.bulkWrite(ops.slice(i, i + CHUNK), { ordered: false });
    upserted += res.upsertedCount || 0;
    modified += res.modifiedCount || 0;
    process.stdout.write(`  ${Math.min(i + CHUNK, ops.length)}/${ops.length}\r`);
  }

  const total = await Rate.countDocuments({});
  console.log(
    `\n✅ Done. upserted=${upserted} modified=${modified}. Rate collection now has ${total} docs.`
  );
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
