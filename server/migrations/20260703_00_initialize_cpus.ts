import { DataTypes } from "sequelize";
import type { QueryInterface } from "sequelize";

type MigrationContext = {
  context: QueryInterface;
};

export async function up({ context: queryInterface }: MigrationContext) {
  await queryInterface.createTable("cpus", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    manufacturer: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Manufacturer is required",
        },
      },
    },
    model: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Model is required",
        },
      },
    },
    cores: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Invalid core amount",
        },
        min: {
          args: [1],
          msg: "Invalid amount of cores",
        },
        notNull: {
          msg: "Cores is required",
        },
      },
    },
    threads: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Invalid thread amount",
        },
        min: {
          args: [1],
          msg: "Invalid amount of threads",
        },
        notNull: {
          msg: "Threads is required",
        },
      },
    },
    cache: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: {
          msg: "Invalid cache format",
        },
        min: {
          args: [1],
          msg: "Invalid cache amount",
        },
        notNull: {
          msg: "Cache is required",
        },
      },
    },
    baseclock: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: {
          msg: "Invalid core clock format",
        },
        min: {
          args: [1],
          msg: "Invalid clock speed",
        },
        notNull: {
          msg: "Base Clock is required",
        },
      },
    },
    boostclock: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: {
          msg: "Invalid core clock format",
        },
        min: {
          args: [1],
          msg: "Invalid clock speed",
        },
        notNull: {
          msg: "Boost Clock is required",
        },
      },
    },
    architecture: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Processor architecture is required",
        },
      },
    },
    mbsocket: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Motherboard socket is required",
        },
      },
    },
  });
}

export async function down({ context: queryInterface }: MigrationContext) {
  await queryInterface.dropTable("cpus");
}
