import app from "./app.js";
import sequelize from "./utils/db.js";
import { runMigrations } from "./utils/migrations.js";

// Utils
import { PORT } from "./utils/config.js";

// Handle the connection and start the server
async function start() {
  try {
    await sequelize.authenticate();
    await runMigrations();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Unable to connect to database:", err);
    } else {
      console.error("Unable to connect to database:", String(err));
    }
    process.exit(1);
  }
}

start();
