import { NextResponse } from "next/server";
import { getSocialLinks } from "@/lib/social-links";

export async function GET() {
  try {
    const links = await getSocialLinks();
    return NextResponse.json(links);
  } catch {
    return NextResponse.json({ error: "Failed to fetch social links" }, { status: 500 });
  }
}
