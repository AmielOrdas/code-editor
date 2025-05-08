import { NextResponse } from "next/server";

import { sql, rootFolderId } from "@/lib/db";
import { createFileSchema, deleteSchema, renameFileSchema } from "@/lib/zod";

// POST method to create a new file
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Get data from the request body

    // Validate input
    const parsedBody = createFileSchema.safeParse(body);

    // If validation fails, return the error response
    if (!parsedBody.success) {
      const errorMessage = parsedBody.error.errors.map((err) => err.message).join(".");
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
    const { name, folder_id, content, extension } = parsedBody.data;

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
      if (
        error.constraint === "unique_file_name_when_no_folder" ||
        "folders_name_parent_id_key"
      ) {
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
    const body = await req.json();

    const parsed = renameFileSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.errors.map((err) => err.message).join(". ");
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    const { id, name, content, extension } = parsed.data;

    // Update file name and content if provided
    const result = await sql`
      UPDATE files 
      SET 
        name = COALESCE(${name}, name),
        content = COALESCE(${content}, content),
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

export async function DELETE(req: Request, res: Response) {
  try {
    const body = await req.json();

    const parsed = deleteSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.errors[0]?.message;

      if (errorMessage === "The root file cannot be deleted") {
        return NextResponse.json({ message: errorMessage }, { status: 403 });
      }

      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    const { id } = parsed.data;

    const result = await sql`
      DELETE FROM files
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    return NextResponse.json({ deletedFile: result[0] }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
  }
}
