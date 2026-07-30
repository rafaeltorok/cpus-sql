import { indexSelector } from "./helper";

let processors;

before(() => {
  // Remove all previous data from the database
  cy.request("POST", `${Cypress.env("backendUrl")}/api/reset`);

  // Add all available sample data
  cy.fixture("processors.json")
    .then((data) => {
      processors = data;
    })
    .then((data) => {
      for (const processor of data) {
        cy.createCpu(processor);
      }
    });
});

after(() => {
  // Remove all sample data after the test suite has finished
  cy.request("POST", `${Cypress.env("backendUrl")}/api/reset`);
});

// Tests
describe("the page index", function () {
  beforeEach(function () {
    // Access the main page
    cy.visit("");
  });

  it("the index can be shown", function () {
    // Show the index
    cy.contains("Show index").click();

    // Assert the hide option is displayed
    cy.should("contain", "Hide index");
  });

  it("all processors are present on the index", function () {
    // Show the index
    cy.contains("Show index").click();

    // Assert each sample processor is present
    for(let i = 0; i < processors.length; i++) {
      cy.get(".index-list li").eq(i).contains(processors[i].model);
    }
  });

  it("selecting an index entry", function () {
    // Show the index
    cy.contains("Show index").click();

    // Select an entry
    indexSelector(`${processors[0].manufacturer} ${processors[0].model}`);
  });

  it("the index can be hidden", function () {
    // Show the index
    cy.contains("Show index").click();

    // Hide it
    cy.contains("Hide index").click();

    // Assert the Show button is displayed again
    cy.should("contain", "Show index");
  });

  it("the back to index button should return to the top of the page", function () {
    // Show the index
    cy.contains("Show index").click();

    // Select an entry
    indexSelector(`${processors[0].manufacturer} ${processors[0].model}`);

    // Click on the respective button below the table
    cy.get(".cpu-data-table")
      .eq(0)
      .parent()
      .find(".back-to-index-button")
      .click();

    // Assert the index is being displayed
    cy.get(".index-list").should("be.visible");
  });
});
