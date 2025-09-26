import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "Andre Luiz",
          email: "andre@email.com",
          password: "senha123",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json({});
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "Andre Luiz",
        email: "andre@email.com",
        password: "senha123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With diplicate 'email'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado1",
          email: "duplicado@email.com",
          password: "senha123",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado2",
          email: "Duplicado@email.com",
          password: "senha123",
        }),
      });

      expect(response2.status).toBe(400);
    });
  });
});
