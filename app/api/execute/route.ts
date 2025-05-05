import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

const PISTON_EXECUTE_URL = "https://emkc.org/api/v2/piston/execute";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { language, version, code } = body;

    if (!language || !version || !code) {
      return NextResponse.json(
        { message: "Missing required fields: language, version, code" },
        { status: 400 }
      );
    }

    const payload = {
      language: language,
      version: version,
      files: [
        {
          content: code,
        },
      ],
    };

    const response = await axios.post(PISTON_EXECUTE_URL, payload);
    const { run } = response.data;

    return NextResponse.json({
      data: run,
      message: "Code Execution Successful",
    });
  } catch (error) {
    console.error("Code execution failed:", error);
    return NextResponse.json({ message: "Code execution failed" }, { status: 500 });
  }
}
