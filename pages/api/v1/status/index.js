import database from "infra/database.js";

async function status(request, response) {
  const result = await database("SELECT 1 + 1 as sum;");
  console.log(result.rows);
  return response.status(200).json({ message: "ola" });
}

export default status;
