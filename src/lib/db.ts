import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.ECOMMERCE_DB_POSTGRES_URL!);
export default sql;
