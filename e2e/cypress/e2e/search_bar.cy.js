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

  describe("basic component functionality", function () {
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
  
  describe("filtering the list based on the search term", function () {
    it("the search term should filter the processors list", function () {
      // Show the search bar
      cy.contains("Search").click();

      const searchTerm = "AMD";

      // Type on the field
      cy.get("#search-bar-input").type(searchTerm);

      // Filter all related processors form the original list
      const filteredProcessors = processors.filter((p) => {
        `${p.manufacturer} ${p.model}`.toLowerCase().includes(searchTerm)
      });

      // Assert all filtered processors are present on the page
      for (const processor of filteredProcessors) {
        cy.contains(`${processor.manufacturer} ${processor.model}`);
      }

      // Assert other unrelated processors are not present on the results
      for (const processor of processors) {
        if (processor.manufacturer === "Intel") {
          cy.contains(`${processor.manufacturer} ${processor.model}`).should("not.exist");
        }
      }
    });

    it("the search functionality should be case-insensitive", function () {
      // Show the search bar
      cy.contains("Search").click();

      // Type on the field
      cy.get("#search-bar-input").type("amd ryzen 5 5600x");

      // Assert the processor was found
      cy.contains("AMD Ryzen 5 5600X").should("be.visible");
    });

    it("searching by a specific term should return proper results", function () {
      // Show the search bar
      cy.contains("Search").click();

      // Type on the field
      cy.get("#search-bar-input").type("5600");

      // Assert the processor was found
      cy.contains("AMD Ryzen 5 5600X").should("be.visible");
    });

    it("it should filter based on the processor line", function () {
      // Show the search bar
      cy.contains("Search").click();

      const searchTerm = "i7";

      // Type on the field
      cy.get("#search-bar-input").type(searchTerm);

      // Filter all related processors form the original list
      const filteredProcessors = processors.filter((p) => {
        `${p.manufacturer} ${p.model}`.toLowerCase().includes(searchTerm)
      });

      // Assert all filtered processors are present on the page
      for (const processor of filteredProcessors) {
        cy.contains(`${processor.manufacturer} ${processor.model}`);
      }

      // Assert other unrelated processors are not present on the results
      for (const processor of processors) {
        if (!processor.model.includes(searchTerm)) {
          cy.contains(`${processor.manufacturer} ${processor.model}`).should("not.exist");
        }
      }
    });

    it("no results should display a proper message", function () {
      // Show the search bar
      cy.contains("Search").click();

      // Type on the field
      cy.get("#search-bar-input").type("no results");

      // Assert the message is being correctly displayed
      cy.contains(/no cpus were found/i).should("be.visible");
    });
  });
});
