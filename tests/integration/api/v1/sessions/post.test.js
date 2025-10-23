import session from "models/session";
import setCookieParser from "set-cookie-parser";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/sessions", () => {
  describe("Anonymous user", () => {
    test("With incorrect 'email' but correct 'password'", async () => {
      await orchestrator.createUser({
        password: "senha123",
      });
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: "email.errado@email.com",
          password: "senha123",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "unauthorizedError",
        message: "Dados de autenticação não conferem",
        action: "Verifique se os dados enviados estão corretos",
        status_code: 401,
      });
    });

    test("With correct 'email' but incorrect 'password'", async () => {
      await orchestrator.createUser({
        email: "email.correto@email.com",
      });
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: "email.correto@email.com",
          password: "senhaErrada",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "unauthorizedError",
        message: "Dados de autenticação não conferem",
        action: "Verifique se os dados enviados estão corretos",
        status_code: 401,
      });
    });

    test("With incorrect 'email' and incorrect 'password'", async () => {
      await orchestrator.createUser({
        username: "user12",
      });
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: "email.incorreto@email.com",
          password: "senhaErrada",
        }),
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "unauthorizedError",
        message: "Dados de autenticação não conferem",
        action: "Verifique se os dados enviados estão corretos",
        status_code: 401,
      });
    });

    test("With correct 'email' and correct 'password'", async () => {
      const createdUser = await orchestrator.createUser({
        email: "usercorreto@email.com",
        password: "senhacorreta",
      });
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: "usercorreto@email.com",
          password: "senhacorreta",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        token: responseBody.token,
        user_id: createdUser.id,
        expires_at: responseBody.expires_at,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: responseBody.token,
        maxAge: session.expiration / 1000,
        path: "/",
        httpOnly: true,
      });
    });
  });
});
