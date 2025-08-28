import database from "infra/database.js";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade ; create schema public");
});

test("GET to /api/v1/migrations", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);

  const migrations = await database.query(
    "SELECT * FROM pgmigrations ORDER BY run_on DESC",
  );

  expect(migrations.rows.length).toBeGreaterThan(0);

  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect(response1.status).toBe(200);

  const response1Body = await response1.json();

  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBe(0);
});
