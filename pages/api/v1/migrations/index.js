import { createRouter } from "next-connect";
import migration from "models/migrator";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const penddendMigrations = await migration.listPendingMigrations();
  return response.status(200).json(penddendMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migration.runPendingMigrations();
  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}
