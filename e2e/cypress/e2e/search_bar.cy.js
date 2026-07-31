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
describe("the search bar", function () {
  beforeEach(function () {
    // Access the main page
    cy.visit("");
  });

  it("the search bar can be shown", function () {
    // Show the search bar
    cy.contains("Search").click();

    // Assert the input field is being displayed
    cy.get("#search-bar-input").should("be.visible");
  });

  it("the search bar can be hidden", function () {
    // Show the search bar
    cy.contains("Search").click();

    // Assert the input field is being displayed
    cy.get("#search-bar-input").should("be.visible");

    // Hide it
    cy.contains("Cancel").click();

    // Confirm the Search button is shown again
    cy.contains("Search").should("be.visible");

    // Assert the input field is hidden
    cy.get("#search-bar-input").should("not.exist");
  });

  it("the search field can be typed on", function () {
    // Show the search bar
    cy.contains("Search").click();

    // Type on the field
    cy.get("#search-bar-input").type("ryzen");

    // Assert the correct value is present on the field
    cy.get("#search-bar-input").should("have.value", "ryzen");
  });
});
