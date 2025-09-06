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
  const { data, isLoading } = useSWR("/api/v1/status", fecthAPI, {
    refreshInterval: 2000,
  });
  let dataBaseDados = "Carregando...";

  if (!isLoading && data) {
    dataBaseDados = (
      <>
        <div>Status do banco : {data.status}</div>
        <div>Versao do banco : {data.dependencies.database.version}</div>
        <div>
          Conecçoes abertas : {data.dependencies.database.current_connections}
        </div>
        <div>
          Maximo de conexoes : {data.dependencies.database.max_connections}
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Banco de dados</h1>
      <div>{dataBaseDados}</div>
    </>
  );
}
