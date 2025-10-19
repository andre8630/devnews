import password from "models/password";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case data", async () => {
      await orchestrator.createUser({
        username: "MesmoCase",
        email: "MesmoCase@email.com",
        password: "senha123",
      });
      const response1 = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
      );

      expect(response1.status).toBe(200);

      const response1Body = await response1.json({});
      expect(response1Body).toEqual({
        id: response1Body.id,
        username: "MesmoCase",
        email: "MesmoCase@email.com",
        password: response1Body.password,
        created_at: response1Body.created_at,
        updated_at: response1Body.updated_at,
      });

      expect(Date.parse(response1Body.created_at)).not.toBeNaN();
      expect(Date.parse(response1Body.updated_at)).not.toBeNaN();
    });

    test("With case missmath", async () => {
      await orchestrator.createUser({
        username: "CaseDiferente",
        email: "CaseDiferente@email.com",
        password: "senha123",
      });

      const response1 = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );

      expect(response1.status).toBe(200);

      const response1Body = await response1.json({});
      expect(response1Body).toEqual({
        id: response1Body.id,
        username: "CaseDiferente",
        email: "CaseDiferente@email.com",
        password: response1Body.password,
        created_at: response1Body.created_at,
        updated_at: response1Body.updated_at,
      });

      expect(Date.parse(response1Body.created_at)).not.toBeNaN();
      expect(Date.parse(response1Body.updated_at)).not.toBeNaN();
    });

    test("With nonexistent username", async () => {
      const response1 = await fetch(
        "http://localhost:3000/api/v1/users/usuarioquenaoexiste",
      );

      expect(response1.status).toBe(404);

      const response1Body = await response1.json({});
      expect(response1Body).toEqual({
        name: "NotFoundError",
        message: "Usuario não encontrado no sistema",
        action: "Verifique se o username está correto",
        status_code: 404,
      });
    });
  });
});
