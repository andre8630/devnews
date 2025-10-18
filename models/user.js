import database from "infra/database.js";
import password from "models/password.js";
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
  await validateUniqueUserName(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function hashPasswordInObject(userInputValues) {
    const hashedPassword = await password.hash(userInputValues.password);
    userInputValues.password = hashedPassword;
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

async function update(username, userInputValues) {
  const currentUser = await findOneByUserName(username);

  if ("username" in userInputValues) {
    await validateUniqueUserName(userInputValues.username);
  }
  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };
  const updatedUser = runUpdateQuery(userWithNewValues);
  return updatedUser;

  async function runUpdateQuery(userWithNewValues) {
    const results = await database.query({
      text: `UPDATE users SET username = $2, email = $3, password = $4, updated_at = timezone('utc', now()) WHERE id = $1 RETURNING *`,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
      ],
    });
    return results.rows[0];
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
      action: "Use outro usuario para esta operação",
    });
  }
}

async function validateUniqueEmail(email) {
  const results = await database.query({
    text: "SELECT email FROM users WHERE LOWER(email) = LOWER($1);",
    values: [email],
  });
  if (results.rowCount > 0) {
    throw new ValidateError({
      message: "Email ja cadastrado",
      action: "Use outro email para esta operação",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const user = {
  create,
  findOneByUserName,
  update,
};

export default user;
