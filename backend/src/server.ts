import { app } from "./app.js";
import { environment } from "./config/environment.js";
import { testConnection, closePool } from "./config/database.js";

const { port, nodeEnv } = environment;

const startServer = async () => {
  // Testar conexão com o banco de dados
  if (environment.db.host) {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.warn("⚠️  Banco de dados não disponível. Usando repositórios em memória.");
    }
  }

  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port} in ${nodeEnv} mode`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log("\n🛑 Encerrando servidor...");
    server.close(() => {
      closePool()
        .then(() => {
          console.log("✅ Servidor encerrado com sucesso");
          process.exit(0);
        })
        .catch((error: Error) => {
          console.error("❌ Erro ao fechar pool:", error);
          process.exit(1);
        });
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

startServer().catch((error) => {
  console.error("❌ Erro ao iniciar servidor:", error);
  process.exit(1);
});
