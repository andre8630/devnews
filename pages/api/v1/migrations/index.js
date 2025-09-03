const migrate = require("node-pg-migrate").default;
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const allowedMethods = ["POST", "GET"];

  if (!allowedMethods.includes(request.method)) {
    return response
      .status(404)
      .json({ message: "End-point só aceita POST ou GET" });
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migrationsValues = {
      dbClient: dbClient,
      databaseUrl: process.env.DATABASE_URL,
      dryRun: true,
      dir: join(process.cwd(), "infra", "migrations"), // <-- garante compatibilidade
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const penddendMigrations = await migrate(migrationsValues);

      return response.status(200).json(penddendMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrate({
        ...migrationsValues,
        dryRun: false,
      });

      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
