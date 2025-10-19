import orchestrator from "tests/orchestrator";
import user from "models/user";
import password from "models/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With nonexistent username", async () => {
      const response1 = await fetch(
        "http://localhost:3000/api/v1/users/usuarioquenaoexiste",
        {
          method: "PATCH",
        },
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

    test("With diplicate 'username'", async () => {
      await orchestrator.createUser({
        username: "user1",
        email: "user1@email.com",
      });

      await orchestrator.createUser({
        username: "user2",
        email: "user2@email.com",
      });

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/user2",
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            username: "user1",
          }),
        },
      );

      expect(response2.status).toBe(400);
    });

    test("With diplicate 'email'", async () => {
      const responseUser1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "email1",
          email: "email1@email.com",
          password: "senha123",
        }),
      });

      const responseUser2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "email2",
          email: "email2@email.com",
          password: "senha123",
        }),
      });
      expect(responseUser1.status).toBe(201);
      expect(responseUser2.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/email2",
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: "email1@email.com",
          }),
        },
      );

      expect(response2.status).toBe(400);
    });

    test("With unique 'username'", async () => {
      const responseUser1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueuser1",
          email: "uniqueuser1@email.com",
          password: "senha123",
        }),
      });

      expect(responseUser1.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/uniqueuser1",
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            username: "uniqueuser2",
          }),
        },
      );
      const responseBody = await response2.json({});
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniqueuser2",
        email: "uniqueuser1@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(response2.status).toBe(200);
    });

    test("With unique 'email'", async () => {
      const responseUser1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueemail1",
          email: "uniqueemail1@email.com",
          password: "senha123",
        }),
      });

      expect(responseUser1.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/uniqueemail1",
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: "uniqueemail2@email.com",
          }),
        },
      );
      const responseBody = await response2.json({});
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniqueemail1",
        email: "uniqueemail2@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(response2.status).toBe(200);
    });

    test("With new 'password'", async () => {
      const responseUser1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "newPassword1",
          email: "newPassword1@email.com",
          password: "newPassword1",
        }),
      });

      expect(responseUser1.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/newPassword1",
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            password: "newPassword2",
          }),
        },
      );
      const responseBody = await response2.json({});
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "newPassword1",
        email: "newPassword1@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(response2.status).toBe(200);

      const userInDataBase = await user.findOneByUserName("newPassword1");
      const correctPasswordMath = await password.compare(
        "newPassword2",
        userInDataBase.password,
      );

      const incorrectPasswordMath = await password.compare(
        "newPassword1",
        userInDataBase.password,
      );

      expect(correctPasswordMath).toBe(true);
      expect(incorrectPasswordMath).toBe(false);
    });
  });
});
