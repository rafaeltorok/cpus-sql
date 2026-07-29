import { fillForm, showCpuData, checkRowData, indexSelector } from "./helper";

// Get the sample data before the tests
let processors;

before(() => {
  cy.fixture("processors.json").then((data) => {
    processors = data;
  });
});

// Tests
describe("CPUs SQL app", function () {
  beforeEach(function () {
    cy.log("BACKEND_BASEURL: " + Cypress.env("backendUrl"));

    // Remove all previous data from the database
    cy.request("POST", `${Cypress.env("backendUrl")}/api/reset`);

    // Access the main page
    cy.visit("");
  });

  describe("basic page rendering", function () {
    it("main page can be opened", function () {
      // Confirm the main page title is being displayed
      cy.contains(/cpu manager/i);
    });
  });

  describe("the add form", function () {
    it.only("a new CPU can be added", function () {
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
    });

    it("an empty name cannot be added", function () {
      // Add invalid data
      fillForm({
        ...processors[0],
        manufacturer: " ",
        model: " ",
      });

      cy.on("window:alert", (alertText) => {
        expect(alertText).to.equal("Invalid CPU data");
      }).then(() => {
        cy.get(".cpu-data-table").should("not.exist");
      });
    });

    it("invalid specifications", function () {
      fillForm({
        manufacturer: "Intel",
        model: "Core i3-10100",
        cores: -1,
        threads: 0,
        cache: 7,
        baseclock: 3.6,
        boostclock: 4.3,
        architecture: "Comet Lake",
        mbsocket: "LGA 1200",
      });

      cy.on("window:alert", (alertText) => {
        expect(alertText).to.equal("Invalid CPU data");
      }).then(() => {
        cy.get(".cpu-data-table").should("not.exist");
      });
    });

    it("invalid clock speeds", function () {
      fillForm({
        manufacturer: "Intel",
        model: "Core i3-10100",
        cores: 4,
        threads: 8,
        cache: 7,
        baseclock: -1,
        boostclock: 0,
        architecture: "Comet Lake",
        mbsocket: "LGA 1200",
      });

      cy.on("window:alert", (alertText) => {
        expect(alertText).to.equal("Invalid CPU data");
      }).then(() => {
        cy.get(".cpu-data-table").should("not.exist");
      });
    });
  });

  describe("testing the CPU data table", function () {
    beforeEach(function () {
      fillForm({
        manufacturer: "Intel",
        model: "Core i3-10100",
        cores: 4,
        threads: 8,
        cache: 7,
        baseclock: 3.6,
        boostclock: 4.3,
        architecture: "Comet Lake",
        mbsocket: "LGA 1200",
      });

      showCpuData("Intel Core i3-10100");
    });

    it("all CPU specifications are displayed when clicking the show button", function () {
      cy.get(".cpu-data-table thead tr th").should(
        "contain",
        "Intel Core i3-10100",
      );
      checkRowData("CORES / THREADS", "4 / 8");
      checkRowData("CACHE", "7 MB");
      checkRowData("BASE CLOCK", "3.6 GHz");
      checkRowData("BOOST CLOCK", "4.3 GHz");
      checkRowData("ARCHITECTURE", "Comet Lake");
      checkRowData("SOCKET", "LGA 1200");
    });

    it("the CPU can be deleted", function () {
      cy.get(".cpu-data-table tbody #delete-cpu-button").click();
      cy.get(".cpu-data-table").should("not.exist");
    });
  });

  describe("the show/hide all data button works", function () {
    beforeEach(function () {
      fillForm({
        manufacturer: "Intel",
        model: "Core i3-10100",
        cores: 4,
        threads: 8,
        cache: 7,
        baseclock: 3.6,
        boostclock: 4.3,
        architecture: "Comet Lake",
        mbsocket: "LGA 1200",
      });

      fillForm({
        manufacturer: "AMD",
        model: "Ryzen 3 1200",
        cores: 4,
        threads: 4,
        cache: 10,
        baseclock: 3.1,
        boostclock: 3.4,
        architecture: "Zen",
        mbsocket: "AM4",
      });

      fillForm({
        manufacturer: "AMD",
        model: "Ryzen 5 1600X",
        cores: 6,
        threads: 12,
        cache: 19,
        baseclock: 3.6,
        boostclock: 4,
        architecture: "Zen",
        mbsocket: "AM4",
      });
    });

    it("it expands and then collapses all tables on the page", function () {
      cy.contains("Show all data").click();
      cy.get(".cpu-data-table")
        .eq(0)
        .then(($table) => {
          cy.wrap($table)
            .find("thead tr th")
            .should("contain", "Intel Core i3-10100");
          checkRowData("CORES / THREADS", "4 / 8");
          checkRowData("CACHE", "7 MB");
          checkRowData("BASE CLOCK", "3.6 GHz");
          checkRowData("BOOST CLOCK", "4.3 GHz");
          checkRowData("ARCHITECTURE", "Comet Lake");
          checkRowData("SOCKET", "LGA 1200");
        });

      cy.get(".cpu-data-table")
        .eq(1)
        .then(($table) => {
          cy.wrap($table).find("thead tr th").should("contain", "Ryzen 3 1200");
          checkRowData("CORES / THREADS", "4 / 4");
          checkRowData("CACHE", "10 MB");
          checkRowData("BASE CLOCK", "3.1 GHz");
          checkRowData("BOOST CLOCK", "3.4 GHz");
          checkRowData("ARCHITECTURE", "Zen");
          checkRowData("SOCKET", "AM4");
        });

      cy.get(".cpu-data-table")
        .eq(2)
        .then(($table) => {
          cy.wrap($table)
            .find("thead tr th")
            .should("contain", "Ryzen 5 1600X");
          checkRowData("CORES / THREADS", "6 / 12");
          checkRowData("CACHE", "19 MB");
          checkRowData("BASE CLOCK", "3.6 GHz");
          checkRowData("BOOST CLOCK", "4 GHz");
          checkRowData("ARCHITECTURE", "Zen");
          checkRowData("SOCKET", "AM4");
        });

      cy.contains("Hide all data").click();
      cy.get(".cpu-data-table")
        .eq(0)
        .then(($table) => {
          cy.wrap($table)
            .find("thead tr th")
            .should("contain", "Intel Core i3-10100");
          cy.wrap($table).find("button").should("contain", "Show");
        });

      cy.get(".cpu-data-table")
        .eq(1)
        .then(($table) => {
          cy.wrap($table).find("thead tr th").should("contain", "Ryzen 3 1200");
          cy.wrap($table).find("button").should("contain", "Show");
        });

      cy.get(".cpu-data-table")
        .eq(2)
        .then(($table) => {
          cy.wrap($table)
            .find("thead tr th")
            .should("contain", "Ryzen 5 1600X");
          cy.wrap($table).find("button").should("contain", "Show");
        });
    });
  });

  describe("testing the index", function () {
    beforeEach(function () {
      fillForm({
        manufacturer: "Intel",
        model: "Core i3-10100",
        cores: 4,
        threads: 8,
        cache: 7,
        baseclock: 3.6,
        boostclock: 4.3,
        architecture: "Comet Lake",
        mbsocket: "LGA 1200",
      });

      fillForm({
        manufacturer: "AMD",
        model: "Ryzen 3 1200",
        cores: 4,
        threads: 4,
        cache: 10,
        baseclock: 3.1,
        boostclock: 3.4,
        architecture: "Zen",
        mbsocket: "AM4",
      });

      fillForm({
        manufacturer: "AMD",
        model: "Ryzen 5 1600X",
        cores: 6,
        threads: 12,
        cache: 19,
        baseclock: 3.6,
        boostclock: 4,
        architecture: "Zen",
        mbsocket: "AM4",
      });
    });

    it("the index can be shown", function () {
      cy.get("#page-index").find("button").contains("Show index").click();

      cy.get("#page-index").find("button").should("contain", "Hide index");
    });

    it("checking if the processors are present in the index", function () {
      cy.get("#page-index").find("button").contains("Show index").click();

      cy.get(".page-index-list li").eq(0).contains("Intel Core i3-10100");

      cy.get(".page-index-list li").eq(1).contains("Ryzen 3 1200");

      cy.get(".page-index-list li").eq(2).contains("Ryzen 5 1600X");
    });

    it("clicking on an index item", function () {
      cy.get("#page-index").find("button").contains("Show index").click();

      indexSelector("Intel Core i3-10100");
    });

    it("the index can be hidden", function () {
      cy.get("#page-index").find("button").contains("Show index").click();

      cy.get("#page-index").find("button").should("contain", "Hide index");

      cy.get("#page-index").find("button").contains("Hide index").click();

      cy.get("#page-index").find("button").should("contain", "Show index");
    });

    it("the back to index button works properly", function () {
      cy.get("#page-index").find("button").contains("Show index").click();

      indexSelector("Intel Core i3-10100");

      cy.get(".cpu-data-table")
        .eq(0)
        .parent()
        .find(".back-to-index-button")
        .click();

      cy.get(".page-index-list").should("be.visible");
    });
  });
});
