import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Rate } from "@/models/Rate";
import { WEBSITE_CITIES } from "@/lib/websiteCities";

// GET /api/rates/destinations/all?airport=YYZ
export async function GET(req: NextRequest) {
  await dbConnect();
  // Show every serviceable city (the full website list) for every airport, so
  // all cities are always selectable. Combos without a published rate fall
  // through to the "Contact us" prompt on the rates page. Union with whatever
  // is in the DB guards against any destination not in the canonical list.
  const dbCities: string[] = await (Rate as any).distinct("destination");
  const destinations = Array.from(new Set([...WEBSITE_CITIES, ...dbCities]));
  destinations.sort((a: string, b: string) => a.localeCompare(b));
  return NextResponse.json(destinations);
}
