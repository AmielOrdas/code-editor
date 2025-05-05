import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DB_URL!);

export default sql;
