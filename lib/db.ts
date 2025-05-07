import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DB_PROD_URL!);
const rootFolderId = process.env.ROOT_FOLDER_ID;

export { sql, rootFolderId };
