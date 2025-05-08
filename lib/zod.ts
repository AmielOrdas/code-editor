// schemas/folderSchema.ts
import { z } from "zod";

const allowedLanguageExtensions = ["js", "py", "ts", "cpp", "java"] as const;

const createFolderSchema = z.object({
  name: z
    .string()
    .min(1, "Folder name is required")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Folder name can only contain letters, numbers, dots, hyphens, and underscores."
    ),
  parent_id: z.string().nullable().optional(),
});

const renameFolderSchema = z.object({
  id: z
    .string()
    .min(1, "Folder ID is required")
    .uuid("Invalid folder ID format")
    .superRefine((id, ctx) => {
      // superRefine is used instead of refine to get the latest value of ROOT_FOLDER_ID. refine() uses the value of env variables in build time while superRefine uses it in runtime.
      if (id === process.env.ROOT_FOLDER_ID) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The root folder cannot be renamed",
          path: ["id"],
        });
      }
    }),

  name: z
    .string()
    .min(1, "Folder name is required")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Folder name can only contain letters, numbers, dots, hyphens, and underscores."
    ),
});

const createFileSchema = z.object({
  name: z
    .string()
    .min(1, "File name is required")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "File name must not contain special characters or spaces."
    )
    .refine(
      (name) => {
        const lastDotIndex = name.lastIndexOf(".");
        return lastDotIndex !== -1; // lastDotIndex === -1 means there is no dot. lastDotIndex !== 1 means there is a dot.
      },
      {
        message: "File extension is required (.js, .py, .ts , .cpp, .java )",
      }
    )

    .refine(
      (name) => {
        const lastDotIndex = name.lastIndexOf(".");
        const baseName = name.substring(0, lastDotIndex).trim();

        return baseName.length > 0;
      },
      {
        message: "File name is required",
      }
    ),
  folder_id: z.string().optional(),
  content: z.string().optional(),
  // extension: z.enum(allowedLanguageExtensions),
  extension: z
    .string()
    .refine((ext) => allowedLanguageExtensions.includes(ext.toLowerCase() as any), {
      message: "Extension not allowed. Use .js, .py, .ts, .cpp, or .java",
    }),
});

const renameFileSchema = z.object({
  id: z.string().min(1, "Folder ID is required").uuid("Invalid folder ID format"),
  name: z
    .string()
    .min(1, "File name is required")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "File name must not contain special characters or spaces."
    )
    .refine(
      (name) => {
        const lastDotIndex = name.lastIndexOf(".");
        return lastDotIndex !== -1; // lastDotIndex === -1 means there is no dot. lastDotIndex !== 1 means there is a dot.
      },
      {
        message: "File extension is required (.js, .py, .ts , .cpp, .java )",
      }
    )

    .refine(
      (name) => {
        const lastDotIndex = name.lastIndexOf(".");
        const baseName = name.substring(0, lastDotIndex).trim();

        return baseName.length > 0;
      },
      {
        message: "File name is required",
      }
    ),

  extension: z
    .string()
    .refine((ext) => allowedLanguageExtensions.includes(ext.toLowerCase() as any), {
      message: "Extension not allowed. Use .js, .py, .ts, .cpp, or .java",
    }),
  content: z.string().optional(),
});

const deleteSchema = z
  .object({
    id: z.string().uuid("Invalid ID format"),
  })
  .superRefine((data, ctx) => {
    // Prevent deletion of ROOT_FOLDER_ID
    if (data.id === process.env.ROOT_FOLDER_ID) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The root folder cannot be deleted",
        path: ["id"],
      });
    }

    // Prevent deletion of ROOT_FILE_ID
    if (data.id === process.env.ROOT_FILE_ID) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The root file cannot be deleted",
        path: ["id"],
      });
    }
  });

export {
  createFolderSchema,
  renameFolderSchema,
  createFileSchema,
  renameFileSchema,
  deleteSchema,
};

//.refine((id) => id !==process.env.ROOT_FILE_ID)
