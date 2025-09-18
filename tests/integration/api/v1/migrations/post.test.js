import database from "infra/database.js";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Runner pendending migrations", () => {
      test("For the first time", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        const responseBody = await response.json();

        expect(response.status).toBe(201);
        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);

        const migrations = await database.query(
          "SELECT * FROM pgmigrations ORDER BY run_on DESC",
        );

        expect(migrations.rows.length).toBeGreaterThan(0);
      });

      test("For the second time", async () => {
        const response1 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        const response1Body = await response1.json();

        expect(response1.status).toBe(200);
        expect(Array.isArray(response1Body)).toBe(true);
        expect(response1Body.length).toBe(0);
      });
    });
  });
});
