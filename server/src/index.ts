import app from "./app";
import sequelize from "./utils/db";

// Utils
import { PORT } from "./utils/config";

// Handle the connection and start the server
async function start() {
  try {
    await sequelize.authenticate();

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
