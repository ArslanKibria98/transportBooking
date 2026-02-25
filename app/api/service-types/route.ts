import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { ServiceType } from "@/models/ServiceType";

export async function GET() {
  await dbConnect();
  const items = await ServiceType.find({} as any, { name: 1 } as any)
    .sort({ name: 1 })
    .lean();
  return NextResponse.json({
    items: items.map((x) => ({ id: String(x._id), name: x.name })),
  });
}

