import sequelize from "../../build/src/utils/db.js";

// Connects to the database and sync all tables
export async function setupDb() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
    } else {
      console.error(String(err));
    }
  }
}

// Close the connection and remove all tables
export async function dbCleanup() {
  await sequelize.drop();
  await sequelize.close();
}
