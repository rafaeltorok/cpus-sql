import { checkRowData } from "./helper";

// Get the sample data before the tests
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

// Tests
describe("the show/hide all data button", function () {
  beforeEach(function () {
    // Access the main page
    cy.visit("");
  });

  it("it expands all tables on the page", function () {
    // Click on the button
    cy.contains(/show all data/i).click();

    // Assert each data table has been expanded
    for (let i = 0; i < processors.length; i++) {
      cy.get(".cpu-data-table")
        .eq(i)
        .then(($table) => {
          cy.wrap($table)
            .find("thead tr th")
            .should("contain", `${processors[i].manufacturer} ${processors[i].model}`);
          checkRowData(/cores \/ threads/i, `${processors[i].cores} / ${processors[i].threads}`);
          checkRowData(/cache/i, `${processors[i].cache} MB`);
          checkRowData(/base clock/i, `${processors[i].baseclock} GHz`);
          checkRowData(/boost clock/i, `${processors[i].boostclock} GHz`);
          checkRowData(/architecture/i, processors[i].architecture);
          checkRowData(/socket/i, processors[i].mbsocket);
          checkRowData(/tdp/i, `${processors[i].tdp} W`);
        });
    }
  });

  it("collapses all tables on the page", function () {
    // Click on the button
    cy.contains(/show all data/i).click();

    // Hide the data
    cy.contains(/hide all data/i).click();

    // Assert each data table has been hidden
    for (let i = 0; i < processors.length; i++) {
      cy.get(".cpu-data-table")
      .eq(i)
      .then(($table) => {
        cy.wrap($table)
          .find("thead tr th")
          .should("contain", `${processors[i].manufacturer} ${processors[i].model}`);
        cy.wrap($table).find("button").should("contain", "Show");
      });
    }
  });
});
