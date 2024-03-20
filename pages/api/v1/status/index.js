import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersion = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnection =
    databaseMaxConnectionResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionResult = await database.query(
    {
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName]
    }
  );

  const databaseOpenedConnection = databaseOpenedConnectionResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersion,
        max_connections: parseInt(databaseMaxConnection),
        open_connections: databaseOpenedConnection,
      },
    },
  });
}

export default status;
