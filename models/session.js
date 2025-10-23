import dadabase from "infra/database";
import crypto from "node:crypto";

const expiration = 60 * 60 * 24 * 30 * 1000; // 30 dias em milesegundos

async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + expiration);
  const newSession = await runInsertQuery(token, userId, expiresAt);
  return newSession;

  async function runInsertQuery(token, userId, expiresAt) {
    const results = await dadabase.query({
      text: `INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3) RETURNING *;`,
      values: [token, userId, expiresAt],
    });
    return results.rows[0];
  }
}

const session = {
  create,
  expiration,
};

export default session;
