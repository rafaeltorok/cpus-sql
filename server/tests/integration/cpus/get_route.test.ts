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

// TypeScript types
import type { CpuType } from "../../../types/types.ts";

const api = supertest(app);

before(async () => {
  // Connect to the PostgreSQL database
  await setupDb();
  
  // Clear all previous data
  await Cpu.truncate({ restartIdentity: true });

  // Add sample data for testing
  for (const processor of processors) {
    await api
      .post("/api/cpus")
      .send(processor)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  }
});

// Clear all table data after the test suite finishes
after(async () => {
  await dbCleanup();
});

describe("the CPUs GET route", () => {
  describe("GET /api/cpus", () => {
    test("returns a json response", async () => {
      await api
        .get("/api/cpus")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("returns all processors", async () => {
      // Get all available processors
      const getResponse = await api
        .get("/api/cpus")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      // Confirm all items have been returned
      assert.strictEqual(getResponse.body.length, processors.length);
    });

    test("all specifications should be present", async () => {
      const getResponse = await api
        .get("/api/cpus")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      // Remove the id fields for each
      const returnedList: CpuType[] = getResponse.body.map((processor: CpuType) => {
        const { id, ...otherFields } = processor;
        return otherFields;
      });

      // Confirm all of the returned data is correct
      assert.deepStrictEqual(processors, returnedList);
    });

    test("returns all float values correctly", async () => {
      const getResponse = await api
        .get("/api/cpus")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      // Filter the correct processor form the returned list
      const returnedProcessor: CpuType = getResponse.body.find(
        (processor: CpuType) => processor.model === "Core i9-10900K"
      );

      // Remove the id field from the response
      const { id, ...otherFields } = returnedProcessor;

      // Get the original data to be compared with
      const originalProcessor = processors.find(
        (processor: CpuType) => processor.model === "Core i9-10900K"
      );

      // Confirm the values are correct
      assert.deepStrictEqual(otherFields, originalProcessor);
    });

    test("returns objects ordered by id", async () => {
      const getResponse = await api
        .get("/api/cpus")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      // Confirm the order is the same as the sample test data
      for (let i = 0; i < processors.length; i++) {
        // Remove the id field
        const { id, ...otherFields }: CpuType = getResponse.body[i];
        assert.deepStrictEqual(otherFields, processors[i]);
      }
    });
  });

  describe("GET /api/cpus/:id", () => {
    test("a single processor can be fetched", async () => {
      const getResponse = await api
        .get("/api/cpus/1")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      // Remove the id field from the response
      const { id, ...otherFields }: CpuType = getResponse.body;

      // Confirm the data is correct
      assert.deepStrictEqual(otherFields, processors[0]);
    });

    test("a non-existing id returns a proper status code", async () => {
      await api
        .get("/api/cpus/0")
        .expect(404)
    });

    test("an invalid id format returns a proper error message", async () => {
      const getResponse = await api
        .get("/api/cpus/ryzen")
        .expect(400)
        .expect("Content-Type", /application\/json/);

      // Confirm an error message is present within the response
      assert.match(getResponse.body.error[0], /invalid id format/i);
    });

    test("a negative id value returns a proper error message", async () => {
      const getResponse = await api
        .get("/api/cpus/-1")
        .expect(400)
        .expect("Content-Type", /application\/json/);

      // Confirm an error message is present within the response
      assert.match(getResponse.body.error[0], /invalid id format/i);
    });
  });
});
