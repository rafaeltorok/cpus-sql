import { DataTypes } from "sequelize";
import type { QueryInterface } from "sequelize";

type MigrationContext = {
  context: QueryInterface;
};

export async function up({ context: queryInterface }: MigrationContext) {
  await queryInterface.addColumn("cpus", "tdp", {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: {
        msg: "Invalid TDP format",
      },
      min: {
        args: [0],
        msg: "Invalid TDP amount",
      },
    },
  });
}

export async function down({ context: queryInterface }: MigrationContext) {
  await queryInterface.removeColumn("cpus", "tdp");
}
