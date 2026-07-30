import { fillForm, showData, checkRowData, showCpuData } from "./helper";

// Get the sample data before the tests
let processors;

before(() => {
  cy.fixture("processors.json").then((data) => {
    processors = data;
  });
});

// Tests
describe("the Add Processor form", function () {
  beforeEach(function () {
    // Remove all previous data from the database
    cy.request("POST", `${Cypress.env("backendUrl")}/api/reset`);

    // Access the main page
    cy.visit("");
  });

  describe("valid data", function () {
    it("a new processor can be added", function () {
      // Get a sample processor
      const processor = processors.find(
        (processor) => processor.model === "Ryzen 5 5600X",
      );

      // Fill the form and submit the data
      fillForm(processor);

      // Submit the data
      cy.contains(/submit/i).click();

      // Assert the processor is present on the list
      cy.contains(`${processor.manufacturer} ${processor.model}`);

      // Confirm the data has been correctly added
      showCpuData(`${processor.manufacturer} ${processor.model}`);
      checkRowData(/cores \/ threads/i, `${processor.cores} / ${processor.threads}`);
      checkRowData(/cache/i, `${processor.cache} MB`);
      checkRowData(/base clock/i, `${processor.baseclock} GHz`);
      checkRowData(/boost clock/i, `${processor.boostclock} GHz`);
      checkRowData(/architecture/i, processor.architecture);
      checkRowData(/socket/i, processor.mbsocket);
      checkRowData(/tdp/i, `${processor.tdp} W`);
    });

    it("min boundary values", function () {
      // Add data to the form
      const processor = {
        ...processors[0],
        cores: 1,
        threads: 1,
        cache: "0.1",
        baseclock: "0.1",
        boostclock: "0.1",
        tdp: 1,
      };

      fillForm(processor);

      // Submit the data
      cy.contains(/submit/i).click();

      // Assert the correct specs are present on the page
      showCpuData(`${processor.manufacturer} ${processor.model}`);
      checkRowData(/cores \/ threads/i, `${processor.cores} / ${processor.threads}`);
      checkRowData(/cache/i, `${processor.cache} MB`);
      checkRowData(/base clock/i, `${processor.baseclock} GHz`);
      checkRowData(/boost clock/i, `${processor.boostclock} GHz`);
      checkRowData(/architecture/i, processor.architecture);
      checkRowData(/socket/i, processor.mbsocket);
      checkRowData(/tdp/i, `${processor.tdp} W`);
    });
  });

  describe("invalid data", function () {
    it("an empty full model name cannot be added", function () {
      // Add invalid data
      fillForm({
        ...processors[0],
        manufacturer: " ",
        model: " ",
      });

      // Submit the data
      cy.contains(/submit/i).click();

      // Assert there is a warning about the invalid data
      cy.on("window:alert", (alertText) => {
        expect(alertText).to.match(/invalid cpu data/i);
      }).then(() => {
        cy.get(processors[0].model).should("not.exist");
      });
    });

    it("negative values", function () {
      // Add invalid data
      fillForm({
        ...processors[0],
        cores: -1,
        threads: -1,
        tdp: -1,
      });

      // Submit the data
      cy.contains(/submit/i).click();

      // Assert there is a warning about the invalid data
      cy.on("window:alert", (alertText) => {
        expect(alertText).to.match(/invalid cpu data/i);
      }).then(() => {
        cy.get(processors[0].model).should("not.exist");
      });
    });

    it("invalid clock speeds", function () {
      // Add invalid data
      fillForm({
        ...processors[0],
        baseclock: -1,
        boostclock: 0,
      });

      // Submit the data
      cy.contains(/submit/i).click();

      // Assert there is a warning about the invalid data
      cy.on("window:alert", (alertText) => {
        expect(alertText).to.match(/invalid cpu data/i);
      }).then(() => {
        cy.get(processors[0].model).should("not.exist");
      });
    });

    it("zero as specs values", function () {
      // Add invalid data
      fillForm({
        ...processors[0],
        cores: 0,
        threads: 0,
      });

      // Submit the data
      cy.contains(/submit/i).click();

      // Assert there is a warning about the invalid data
      cy.on("window:alert", (alertText) => {
        expect(alertText).to.match(/invalid cpu data/i);
      }).then(() => {
        cy.get(processors[0].model).should("not.exist");
      });
    });

    it("non-numeric values", function () {
      // Add invalid data
      fillForm({
        ...processors[0],
        cores: "cores",
        threads: "threads",
        tdp: "tdp",
      });

      // Submit the data
      cy.contains(/submit/i).click();

      // Assert there is a warning about the invalid data
      cy.on("window:alert", (alertText) => {
        expect(alertText).to.match(/invalid cpu data/i);
      }).then(() => {
        cy.get(processors[0].model).should("not.exist");
      });
    });
  });
});
