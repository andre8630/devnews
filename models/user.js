import database from "infra/database.js";
import { ValidateError, NotFoundError } from "infra/errors";

async function findOneByUserName(username) {
  const userFound = await runSelectQuery(username);
  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: "SELECT * FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1;",
      values: [username],
    });
    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Usuario não encontrado no sistema",
        action: "Verifique se o username está correto",
      });
    }
    return results.rows[0];
  }
}

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUserName(userInputValues.username);
  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: "SELECT email FROM users WHERE LOWER(email) = LOWER($1);",
      values: [email],
    });
    if (results.rowCount > 0) {
      throw new ValidateError({
        message: "Email ja cadastrado",
        action: "Cadastre outro email ou faça o login",
      });
    }
  }

  async function validateUniqueUserName(username) {
    const results = await database.query({
      text: "SELECT username FROM users WHERE LOWER(username) = LOWER($1);",
      values: [username],
    });
    if (results.rowCount > 0) {
      throw new ValidateError({
        message: "Usuario ja cadastrado",
        action: "Use outro usuario ou faça o login",
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;",
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return results.rows[0];
  }
}

const user = {
  create,
  findOneByUserName,
};

export default user;
