import user from "models/user";
import password from "models/password";
import { unauthorizedError } from "infra/errors";

async function getAuthenticatedUser(providEmail, providePassword) {
  try {
    const storedUser = await findUserByEmail(providEmail);
    await validatePassword(providePassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof unauthorizedError) {
      throw new unauthorizedError({
        message: "Dados de autenticação não conferem",
        action: "Verifique se os dados enviados estão corretos",
      });
    }
    throw error;
  }

  async function findUserByEmail(providEmail) {
    let storedUser;
    try {
      storedUser = await user.findOneByEmail(providEmail);
    } catch (error) {
      console.log(error);
      throw new unauthorizedError({
        message: "Dados de autenticação não conferem",
        action: "Verifique se os dados enviados estão corretos",
      });
    }
    return storedUser;
  }

  async function validatePassword(providePassword, storedPassword) {
    const comparePassword = await password.compare(
      providePassword,
      storedPassword,
    );
    if (!comparePassword) {
      throw new unauthorizedError({
        message: "Dados de autenticação não conferem",
        action: "Verifique se os dados enviados estão corretos",
      });
    }
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
