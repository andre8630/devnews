const migrate = require("node-pg-migrate").default;
import { join } from "node:path";
import database from "infra/database.js";

const migrationsValues = {
  databaseUrl: process.env.DATABASE_URL,
  dryRun: true,
  dir: join(process.cwd(), "infra", "migrations"), // <-- garante compatibilidade
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const penddendMigrations = await migrate({
      ...migrationsValues,
      dbClient: dbClient,
    });

    return penddendMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrate({
      ...migrationsValues,
      dbClient: dbClient,
      dryRun: false,
    });

    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}

const migration = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migration;
