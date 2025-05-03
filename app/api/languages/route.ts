import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

const PISTON_RUNTIMES_URL = "https://emkc.org/api/v2/piston/runtimes";

export async function GET(req: NextRequest) {
  try {
    const response = await axios.get(PISTON_RUNTIMES_URL);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to fetch runtimes:", error);
    return NextResponse.json({ message: "Failed to fetch runtimes" }, { status: 500 });
  }
}
