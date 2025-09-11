import { createRouter } from "next-connect";
const migrate = require("node-pg-migrate").default;
import { join } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

const migrationsValues = {
  databaseUrl: process.env.DATABASE_URL,
  dryRun: true,
  dir: join(process.cwd(), "infra", "migrations"), // <-- garante compatibilidade
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const penddendMigrations = await migrate({
      ...migrationsValues,
      dbClient: dbClient,
    });

    return response.status(200).json(penddendMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrate({
      ...migrationsValues,
      dbClient: dbClient,
      dryRun: false,
    });

    return response.status(200).json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
}
