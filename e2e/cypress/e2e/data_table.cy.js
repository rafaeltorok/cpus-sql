import { showCpuData, checkRowData } from "./helper";

// Get the sample data before the tests
let processors;

before(() => {
  cy.fixture("processors.json").then((data) => {
    processors = data;
  });
});

after(() => {
  // Remove all sample data after the test suite has finished
  cy.request("POST", `${Cypress.env("backendUrl")}/api/reset`);
});

// Tests
describe("testing the CPU data table", function () {
  beforeEach(function () {
    // Remove all previous data from the database
    cy.request("POST", `${Cypress.env("backendUrl")}/api/reset`);
    
    // Add a sample processor
    const processor = processors.find((p) => p.model === "Ryzen 5 5600X");
    cy.createCpu(processor);

    // Access the main page
    cy.visit("");
  });

  it("all specifications are displayed when clicking the show button", function () {
    const processor = processors.find((p) => p.model === "Ryzen 5 5600X");

    // Click on the show button
    showCpuData(`${processor.manufacturer} ${processor.model}`);

    // Assert all specifications are being correctly displayed
    checkRowData(/cores \/ threads/i, `${processor.cores} / ${processor.threads}`);
    checkRowData(/cache/i, `${processor.cache} MB`);
    checkRowData(/base clock/i, `${processor.baseclock} GHz`);
    checkRowData(/boost clock/i, `${processor.boostclock} GHz`);
    checkRowData(/architecture/i, processor.architecture);
    checkRowData(/socket/i, processor.mbsocket);
    checkRowData(/tdp/i, `${processor.tdp} W`);
  });

  it("the processor can be removed", function () {
    const processor = processors.find((p) => p.model === "Ryzen 5 5600X");

    // Expand the data table
    showCpuData(`${processor.manufacturer} ${processor.model}`);

    // Select the Delete button
    cy.contains("Delete").click();

    // Confirm the data table has been removed from the list
    cy.get(`${processor.manufacturer} ${processor.model}`).should("not.exist");
  });
});