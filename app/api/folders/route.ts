import { NextResponse } from "next/server";
import { sql, rootFolderId } from "@/lib/db";

// POST method for creating folders
export async function POST(req: Request, res: Response) {
  try {
    const { name, parent_id } = await req.json();

    // Validate input
    if (!name) {
      return NextResponse.json({ message: "Folder name is required" }, { status: 400 });
    }

    // Insert the new folder
    const result = await sql`
      INSERT INTO folders (name, parent_id, deleted_at)
      VALUES (
        ${name},
        ${parent_id || rootFolderId},
        NOW() + INTERVAL '30 minutes'
      )
      RETURNING *;
    `;

    return NextResponse.json({ newFolder: result[0] }, { status: 201 });
  } catch (error: unknown) {
    console.log(error);
    if (error instanceof Error && typeof error === "object" && "constraint" in error) {
      if (
        error.constraint === "unique_root_folder_names" ||
        "folders_name_parent_id_key"
      ) {
        return NextResponse.json(
          { message: "A folder with that name already exists in this same level." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
  }
}

// PATCH method to update folder name
export async function PATCH(req: Request, res: Response) {
  try {
    const { id, name } = await req.json();

    if (!id || !name) {
      return NextResponse.json(
        { message: "Folder ID and name are required" },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE folders
      SET
        name = ${name},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      return NextResponse.json({ message: "Folder not found" }, { status: 404 });
    }

    return NextResponse.json({ updatedFolder: result[0] }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error && typeof error === "object" && "constraint" in error) {
      if (error.constraint === "unique_root_folders_names") {
        return NextResponse.json(
          { message: "A folder with that name already exists in this same level." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
  }
}

// GET method to fetch all folders
export async function GET(req: Request, res: Response) {
  try {
    const folders = await sql`
      SELECT * FROM folders
      ORDER BY name ASC;
    `;

    return NextResponse.json({ folders }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
  }
}
