import { app } from "./app.js";
import { environment } from "./config/environment.js";

const { port, nodeEnv } = environment;

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port} in ${nodeEnv} mode`);
});
