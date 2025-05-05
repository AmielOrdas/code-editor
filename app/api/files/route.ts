import { NextResponse } from "next/server";

import sql from "@/lib/db";

// POST method to create a new file
export async function POST(req: Request) {
  try {
    const { name, folder_id, content } = await req.json(); // Get data from the request body

    // Validate input
    if (!name || !folder_id) {
      return NextResponse.json(
        { message: "File name and folder ID are required" },
        { status: 400 }
      );
    }

    // Insert the new file into the database
    const result = await sql`
      INSERT INTO files (id, name, folder_id, content,deleted_at )
      VALUES ($${name}, ${folder_id}, ${content || ""}, NOW() + INTERVAL '30 minutes'
      RETURNING *;
    `;

    // If successful, return the created file
    return NextResponse.json({ newFile: result[0] }, { status: 201 });
  } catch (error: unknown) {
    // Handle any errors and send an error response
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
  }
}

// PATCH method to update file name and file content/code
export async function PATCH(req: Request) {
  try {
    const { id, name, content } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "File ID is required" }, { status: 400 });
    }

    // Update file name and content if provided
    const result = await sql`
      UPDATE files 
      SET 
        name = COALESCE(${name}, name),
        content = COALESCE(${content}, content),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    return NextResponse.json({ updatedFile: result[0] }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
  }
}
// Get all files
export async function GET(req: Request, res: Response) {
  try {
    const files = await sql`
      SELECT * FROM files 
     
      ORDER BY name ASC;
    `;

    return NextResponse.json({ files }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
  }
}
