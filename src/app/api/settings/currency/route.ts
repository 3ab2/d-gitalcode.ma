import { NextResponse } from "next/server";
import { getPublicCurrencySettings } from "@/lib/currency/settings";

export async function GET() {
  const data = await getPublicCurrencySettings();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
