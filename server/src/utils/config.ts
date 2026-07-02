import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3001;

const DATABASE_URL: string = process.env.DATABASE_URL || "";

export { PORT, DATABASE_URL };
