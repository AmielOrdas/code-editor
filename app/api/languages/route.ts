import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

const PISTON_RUNTIMES_URL = "https://emkc.org/api/v2/piston/runtimes";
const allowedLanguages = ["javascript", "typescript", "python", "java", "c++"];
const allowedRuntimes = ["node", "bash", "gcc"];

export async function GET(req: NextRequest) {
  try {
    const response = await axios.get(PISTON_RUNTIMES_URL);

    const filteredAllowedLanguages = response.data.filter(
      (languages: any) =>
        allowedLanguages.includes(languages.language) &&
        (languages.runtime ? allowedRuntimes.includes(languages.runtime) : true)
    );

    return NextResponse.json(filteredAllowedLanguages);
  } catch (error) {
    console.error("Failed to fetch runtimes:", error);
    return NextResponse.json({ message: "Failed to fetch runtimes" }, { status: 500 });
  }
}
