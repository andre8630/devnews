import database from "infra/database.js";

async function status(request, response) {
  const versionDataBase = await database("SHOW server_version;");
  const maxConnections = await database("SHOW max_connections;");

  const dataBaseName = process.env.POSTGRES_DB;
  const currentConnections = await database({
    text: "SELECT COUNT(*) ::int FROM pg_stat_activity WHERE datname= $1;",
    values: [dataBaseName],
  });

  const updateAt = new Date().toISOString();

  let st = "";
  if (response.status(200)) {
    st = "Ok";
  } else {
    st = "Off";
  }

  response.status(200).json({
    status: st,
    update_at: updateAt,
    dependencies: {
      database: {
        version: versionDataBase.rows[0].server_version,
        max_connections: parseInt(maxConnections.rows[0].max_connections),
        current_connections: currentConnections.rows[0].count,
      },
    },
  });
}

export default status;
