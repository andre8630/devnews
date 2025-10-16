import bcrypyjs from "bcryptjs";

async function hash(password) {
  const rounds = getNumberOfRounds();
  return await bcrypyjs.hash(password, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providePassword, storedPassword) {
  return await bcrypyjs.compare(providePassword, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
