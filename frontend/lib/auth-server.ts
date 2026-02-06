import { betterAuth } from "better-auth";
import { Pool } from "pg";

// Create a custom PostgreSQL pool with proper SSL configuration for Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') 
    ? { rejectUnauthorized: false }
    : undefined,
});

// Better Auth configuration with custom database adapter
export const auth = betterAuth({
  database: pool as any,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-min-32-chars-long!",
  baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000",
  advanced: {
    useSecureCookies: false,
    cookiePrefix: "better-auth",
  },
});
