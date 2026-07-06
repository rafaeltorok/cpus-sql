import { describe, test, before, after } from "node:test";
import assert from "node:assert";
import supertest from "supertest";

// Setup
import { setupDb, dbCleanup } from "../setup.ts";

// Express app
import app from "../../../build/src/app.js";

// Models
import Cpu from "../../../build/src/models/cpu.js";

// Test data
import processors from "../fixtures/processors.ts";

const api = supertest(app);

before(async () => {
  await setupDb();
  
  await Cpu.truncate({ restartIdentity: true });

  for (const processor of processors) {
    await api
      .post("/api/cpus")
      .send(processor)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  }
});

after(async () => {
  await dbCleanup();
});

describe("the CPUs GET route", () => {
  test("All processors are return as json", async () => {
    await api
      .get("/api/cpus")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("All processors are returned", async () => {
    // Get all available processors
    const getResponse = await api
      .get("/api/cpus")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Confirm all items have been returned
    assert.strictEqual(getResponse.body.length, processors.length);
  });
});
