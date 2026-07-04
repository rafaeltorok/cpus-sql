import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3001;

let DATABASE_URL: string;

// Define which database should be used, the main or the test one
if (process.env.NODE_ENV === "test") {
  DATABASE_URL = process.env.TEST_DATABASE_URL || "";
} else {
  DATABASE_URL = process.env.DATABASE_URL || "";
}

export { PORT, DATABASE_URL };
