import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

const PISTON_EXECUTE_URL = "https://emkc.org/api/v2/piston/execute";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { language, version, sourceCode } = body;

    if (!language || !version || !sourceCode) {
      return NextResponse.json(
        { message: "Missing required fields: language, version, sourceCode" },
        { status: 400 }
      );
    }

    const payload = {
      language: language,
      version: version,
      files: [
        {
          content: sourceCode,
        },
      ],
    };

    const response = await axios.post(PISTON_EXECUTE_URL, payload);

    return NextResponse.json({
      data: response.data,
      message: "Code Execution Successful",
    });
  } catch (error) {
    console.error("Code execution failed:", error);
    return NextResponse.json({ message: "Code execution failed" }, { status: 500 });
  }
}
