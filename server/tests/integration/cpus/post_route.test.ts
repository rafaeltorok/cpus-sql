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
  
  test("a new processor can be created", async () => {
	// Get a sample processor to be added
	const cpu = processors[0];
	  
	// Get the initial list of processors
	const initialProcessors = await api
	  .get("/api/cpus")
	  .expect(200)
	  .expect("Content-Type", /application\/json/);
	  
    // Add a new processor
    const postResponse = await api
      .post("/api/cpus")
      .send(cpu)
      .expect(201)
      .expect("Content-Type", /application\/json/);
       
    // Get the current list of processors
	const currentProcessors = await api
	  .get("/api/cpus")
	  .expect(200)
	  .expect("Content-Type", /application\/json/);

    // Confirm the amount of processors has been increased
    assert.strictEqual(currentProcessors.body.length, initialProcessors.body.length + 1);
  });
  
  test("the processor specifications should be correctly returned within te response", async () => {
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
});
