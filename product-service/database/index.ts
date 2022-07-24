import postgres from "postgres";

export const sql = postgres({
  idle_timeout: 20,
  max_lifetime: 60 * 10,
});
