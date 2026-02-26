import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "vehicles");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}-${originalName}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    await writeFile(filepath, buffer);
    console.log("[Upload] File saved to:", filepath);

    // Return public URL
    // In production, use absolute URL for proper image loading
    const isProduction = process.env.NODE_ENV === "production";
    let baseUrl = "";
    
    if (isProduction) {
      // Try multiple sources for base URL
      const host = process.env.RAILWAY_PUBLIC_DOMAIN || 
                   process.env.NEXT_PUBLIC_BASE_URL ||
                   process.env.VERCEL_URL;
      
      if (host) {
        baseUrl = host.startsWith("http") ? host : `https://${host}`;
      } else {
        // Fallback: get from request headers
        const protocol = req.headers.get("x-forwarded-proto") || "https";
        const hostHeader = req.headers.get("host");
        if (hostHeader) {
          baseUrl = `${protocol}://${hostHeader}`;
        }
      }
    }
    
    // Use relative URL - Next.js automatically serves files from /public
    // In production, we can use absolute URL if baseUrl is available
    const publicUrl = baseUrl ? `${baseUrl}/uploads/vehicles/${filename}` : `/uploads/vehicles/${filename}`;
    
    // Note: Railway's filesystem is ephemeral - files get deleted on redeploy
    // For permanent storage, consider using cloud storage (Cloudinary, S3, etc.)
    
    console.log("[Upload] Environment:", isProduction ? "production" : "development");
    console.log("[Upload] Base URL:", baseUrl || "relative (using /uploads/...)");
    console.log("[Upload] Returning URL:", publicUrl);
    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("[Upload] Error:", error);
    return NextResponse.json(
      { error: "Failed to upload file", details: error?.message },
      { status: 500 }
    );
  }
}
