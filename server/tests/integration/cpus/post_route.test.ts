import { describe, test, before, after, beforeEach } from "node:test";
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

// Helper functions
async function getAmount(): Promise<number> {
  const response = await api
    .get("/api/cpus")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  return response.body.length;
}

before(async () => {
  // Connect to the PostgreSQL database
  await setupDb();
});

// Clear all table data after the test suite finishes
after(async () => {
  await dbCleanup();
});

describe("POST /api/cpus", () => {
  beforeEach(async () => {
    // Clear all previous data
    await Cpu.truncate({ restartIdentity: true });
  });

  describe("Valid processor data", () => {
    test("a new processor can be created", async () => {
      // Get a sample processor to be added
      const cpu = processors[0];

      // Get the initial list of processors
      const initialProcessors = await getAmount();

      // Add a new processor
      const postResponse = await api
        .post("/api/cpus")
        .send(cpu)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // Get the current list of processors
      const currentProcessors = await getAmount();

      // Confirm the amount of processors has been increased
      assert.strictEqual(currentProcessors, initialProcessors + 1);
    });

    test("returns all specifications within the response", async () => {
      // Get a sample processor to be added
      const cpu = processors[0];

      // Add a new processor
      const postResponse = await api
        .post("/api/cpus")
        .send(cpu)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // Remove the id field from the response
      const { id, ...otherFields } = postResponse.body;

      // Confirm the returned data is correct
      assert.deepStrictEqual(processors[0], otherFields);
    });

    test("multiple processors can be added", async () => {
      // Add all available test data
      for (const processor of processors) {
        const postResponse = await api
          .post("/api/cpus")
          .send(processor)
          .expect(201)
          .expect("Content-Type", /application\/json/);
      }

      // Get the current amount of processors
      const currentProcessors = await getAmount();

      // Confirm the total number of processors is present
      assert.deepStrictEqual(processors.length, currentProcessors);
    });

    test("a float value for the cache should be valid", async () => {
      // Get a sample processor to be added
      const originalProcessor = processors.find(
        (processor: CpuType) => processor.model === "Core i9-10900K",
      );

      // Add the processor
      const postResponse = await api
        .post("/api/cpus")
        .send(originalProcessor)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // Extract only the cache field from the response
      const { cache, ...otherFields } = postResponse.body;

      // Confirm the returned data is correct
      assert.deepStrictEqual(originalProcessor?.cache, cache);
    });

    test("the min boundary values should be accepted", async () => {
      // Add the min values for all fields
      const cpu = {
        ...processors[0],
        cores: 1,
        threads: 1,
        cache: 0.1,
        baseClock: 0.1,
        boostClock: 0.1,
        tdp: 0,
      };

      // Get the initial list of processors
      const initialProcessors = await getAmount();

      // Add a new processor
      const postResponse = await api
        .post("/api/cpus")
        .send(cpu)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // Get the current list of processors
      const currentProcessors = await getAmount();

      // Confirm the amount of processors has been increased
      assert.strictEqual(currentProcessors, initialProcessors + 1);
    });

    test("a float boundary should be accepted", async () => {
      const cpu = {
        ...processors[0],
        cores: 1.0,
        threads: 1.0,
        tdp: 1.0,
      };

      // Get the initial list of processors
      const initialProcessors = await getAmount();

      // Add a new processor
      await api
        .post("/api/cpus")
        .send(cpu)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // Get the current list of processors
      const currentProcessors = await getAmount();

      // Confirm the amount of processors has been increased
      assert.strictEqual(currentProcessors, initialProcessors + 1);
    });

    test("the TDP field is optional", async () => {
      const { tdp, ...otherFields } = processors[0];

      // Get the initial list of processors
      const initialProcessors = await getAmount();

      // Add a new processor
      const postResponse = await api
        .post("/api/cpus")
        .send(otherFields)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // Get the current list of processors
      const currentProcessors = await getAmount();

      // Confirm the amount of processors has been increased
      assert.strictEqual(currentProcessors, initialProcessors + 1);

      // Assert the TDP should default to 0 when not present
      assert.strictEqual(postResponse.body.tdp, 0);
    });
  });

  describe("Invalid processor data", () => {
    test("returns a proper status code and error messages with an empty request body", async () => {
      // Get the initial list of processors
      const initialProcessors = await getAmount();

      // Add a new processor
      const postResponse = await api
        .post("/api/cpus")
        .expect(400)
        .expect("Content-Type", /application\/json/);

      // Get the current list of processors
      const currentProcessors = await getAmount();

      // Confirm the amount of processors has not changed
      assert.strictEqual(currentProcessors, initialProcessors);

      // Assert there are error messages within the response
      assert.ok(postResponse.body.error.length > 0);
    });

    test("returns error messages with an invalid processor name", async () => {
      const invalidData = {
        ...processors[0],
        manufacturer: "",
        model: "",
      };

      // Get the initial list of processors
      const initialProcessors = await getAmount();

      // Add a new processor
      const postResponse = await api
        .post("/api/cpus")
        .send(invalidData)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      // Get the current list of processors
      const currentProcessors = await getAmount();

      // Confirm the amount of processors has not changed
      assert.strictEqual(currentProcessors, initialProcessors);

      // Assert there are error messages within the response
      assert.ok(postResponse.body.error.includes("Manufacturer is required"));
      assert.ok(postResponse.body.error.includes("Model is required"));
    });

    test("returns an error message with a zero value", async () => {
      const invalidData = {
        ...processors[0],
        cores: 0,
      };

      // Get the initial list of processors
      const initialProcessors = await getAmount();

      // Add a new processor
      const postResponse = await api
        .post("/api/cpus")
        .send(invalidData)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      // Get the current list of processors
      const currentProcessors = await getAmount();

      // Confirm the amount of processors has not changed
      assert.strictEqual(currentProcessors, initialProcessors);

      // Assert there is an error message within the response
      assert.ok(postResponse.body.error.includes("Invalid amount of cores"));
    });

    test("returns an error message with a negative value", async () => {
      const invalidData = {
        ...processors[0],
        cores: -1,
      };

      // Get the initial list of processors
      const initialProcessors = await getAmount();

      // Add a new processor
      const postResponse = await api
        .post("/api/cpus")
        .send(invalidData)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      // Get the current list of processors
      const currentProcessors = await getAmount();

      // Confirm the amount of processors has not changed
      assert.strictEqual(currentProcessors, initialProcessors);

      // Assert there is an error message within the response
      assert.ok(postResponse.body.error.includes("Invalid amount of cores"));
    });

    test("returns an error message with a non-numeric value", async () => {
      const invalidData = {
        ...processors[0],
        cores: "8",
      };

      // Get the initial list of processors
      const initialProcessors = await getAmount();

      // Add a new processor
      const postResponse = await api
        .post("/api/cpus")
        .send(invalidData)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      // Get the current list of processors
      const currentProcessors = await getAmount();

      // Confirm the amount of processors has not changed
      assert.strictEqual(currentProcessors, initialProcessors);

      // Assert there is an error message within the response
      assert.ok(postResponse.body.error.includes("Invalid core amount"));
    });

    test("returns an error message with a null value", async () => {
      const invalidData = {
        ...processors[0],
        cores: null,
      };

      // Get the initial list of processors
      const initialProcessors = await getAmount();

      // Add a new processor
      const postResponse = await api
        .post("/api/cpus")
        .send(invalidData)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      // Get the current list of processors
      const currentProcessors = await getAmount();

      // Confirm the amount of processors has not changed
      assert.strictEqual(currentProcessors, initialProcessors);

      // Assert there is an error message within the response
      assert.ok(postResponse.body.error.includes("Invalid core amount"));
    });

    test("returns an error message with an undefined value", async () => {
      const { cores, ...otherFields } = processors[0];

      // Get the initial list of processors
      const initialProcessors = await getAmount();

      // Add a new processor
      const postResponse = await api
        .post("/api/cpus")
        .send(otherFields)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      // Get the current list of processors
      const currentProcessors = await getAmount();

      // Confirm the amount of processors has not changed
      assert.strictEqual(currentProcessors, initialProcessors);

      // Assert there is an error message within the response
      assert.ok(postResponse.body.error.includes("Invalid core amount"));
    });

    test("returns error messages with decimal values on integer fields", async () => {
      const cpu = {
        ...processors[0],
        cores: 0.1,
        threads: 0.1,
        tdp: 0.1,
      };

      // Get the initial list of processors
      const initialProcessors = await getAmount();

      // Add a new processor
      const postResponse = await api
        .post("/api/cpus")
        .send(cpu)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      // Get the current list of processors
      const currentProcessors = await getAmount();

      // Confirm the amount of processors has not changed
      assert.strictEqual(currentProcessors, initialProcessors);

      // Assert there are error messages within the response
      assert.ok(postResponse.body.error.includes("Invalid amount of cores"));
      assert.ok(postResponse.body.error.includes("Invalid amount of threads"));
      assert.ok(postResponse.body.error.includes("Invalid TDP amount"));
    });
  });
});
