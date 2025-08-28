const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", hanleReturn);

  function hanleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      setTimeout(() => {
        checkPostgres();
      }, 100);
      return;
    }
    console.log("\n🟢 Conexão estabelecida com sucesso!\n");
  }
}

process.stdout.write("\n\n🔴 Aguardando conexão");
checkPostgres();
