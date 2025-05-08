import { NextResponse } from "next/server";
import axios from "axios";
import {
  allowedLanguages,
  allowedRuntimes,
  PISTON_RUNTIMES_URL,
  TLanguage,
} from "@/lib/Types&Constants";

export async function GET() {
  try {
    const response = await axios.get(PISTON_RUNTIMES_URL);

    const filteredAllowedLanguages = response.data.filter(
      (languages: TLanguage) =>
        allowedLanguages.includes(languages.language) &&
        (languages.runtime ? allowedRuntimes.includes(languages.runtime) : true)
    );

    return NextResponse.json(filteredAllowedLanguages);
  } catch (error) {
    console.error("Failed to fetch runtimes:", error);
    return NextResponse.json({ message: "Failed to fetch runtimes" }, { status: 500 });
  }
}
