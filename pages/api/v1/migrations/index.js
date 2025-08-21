import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
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
    const penddendMigrations = await migrationRunner(migrationsValues);
    await dbClient.end();
    return response.status(200).json(penddendMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...migrationsValues,
      dryRun: false,
    });
    await dbClient.end();
    return response.status(200).json(migratedMigrations);
  }
  return response.status(405);
}
