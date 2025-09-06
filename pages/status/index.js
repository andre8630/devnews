import useSWR from "swr";

async function fecthAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { data, isLoading } = useSWR("/api/v1/status", fecthAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.update_at).toLocaleString("pt-BR");
  }
  return (
    <>
      <div>Ultima atualizaçao : {updatedAtText}</div>
    </>
  );
}

function DatabaseStatus() {
  const { data } = useSWR("/api/v1/status", fecthAPI, {
    refreshInterval: 2000,
  });

  let statusOk = data.status;
  let connectionOpen = data.dependencies.database.current_connections;
  let maxConnections = data.dependencies.database.max_connections;
  let versionDb = data.dependencies.database.version;

  return (
    <>
      <h1>Banco de dados</h1>
      <div>Status do banco : {statusOk}</div>
      <div>Versao do banco : {versionDb}</div>
      <div>Conexçoes abertas : {connectionOpen}</div>
      <div>Status do banco : {maxConnections}</div>
    </>
  );
}
