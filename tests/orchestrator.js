import retry from "async-retry";
import database from "infra/database";
import migration from "models/migrator";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      maxTimeout: 1000,
      retries: 100,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (!response.ok) {
        throw new console.error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade ; create schema public");
}

async function runPendingMigrations() {
  await migration.runPendingMigrations();
}
const orchastrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
};
export default orchastrator;
