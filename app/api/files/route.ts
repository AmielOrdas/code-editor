import { NextResponse } from "next/server";

import { sql, rootFolderId } from "@/lib/db";

// POST method to create a new file
export async function POST(req: Request) {
  try {
    const { name, folder_id, content, extension } = await req.json(); // Get data from the request body

    // Validate input
    if (!name) {
      return NextResponse.json({ message: "File is required" }, { status: 400 });
    }

    // Insert the new file into the database
    const result = await sql`
    INSERT INTO files (name, folder_id, content, extension, deleted_at)
    VALUES (
    ${name}, 
    ${folder_id || rootFolderId}, 
    ${content || ""}, 
    ${extension}, 
    NOW() + INTERVAL '30 minutes'
    )
    RETURNING *;
`;

    // If successful, return the created file
    return NextResponse.json({ newFile: result[0] }, { status: 201 });
  } catch (error: unknown) {
    // Handle any errors and send an error response

    if (error instanceof Error && typeof error === "object" && "constraint" in error) {
      if (error.constraint === "unique_file_name_when_no_folder") {
        return NextResponse.json(
          { message: "A file with that name already exists at the same level." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
  }
}

// PATCH method to update file name , file extension and file content/code
export async function PATCH(req: Request) {
  try {
    const { id, name, content, extension } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "File ID is required" }, { status: 400 });
    } else if (!name) {
      return NextResponse.json({ message: "File name is required" }, { status: 400 });
    } else if (!extension) {
      return NextResponse.json(
        { message: "File extension is required" },
        { status: 400 }
      );
    }

    const safeContent = content ?? ""; // If content is null or undefined, it will default to an empty string

    // Update file name and content if provided
    const result = await sql`
      UPDATE files 
      SET 
        name = COALESCE(${name}, name),
        content = COALESCE(${safeContent}, content),
        extension = COALESCE(${extension}, extension),
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
