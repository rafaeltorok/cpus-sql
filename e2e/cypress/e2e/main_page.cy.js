describe("the Web UI", function () {
  beforeEach(function () {
    // Access the main page
    cy.visit("");
  });

  describe("basic page rendering", function () {
    it("main page can be opened", function () {
      // Confirm the main page title is being displayed
      cy.contains(/cpu manager/i);
    });
  });

  describe("the Web UI buttons", function () {
    it("the Add Processor button is visible", function () {
      cy.contains(/add processor/i);
    });

    it("the Search button is visible", function () {
      cy.contains(/search/i);
    });

    it("the Index button is visible", function () {
      cy.contains(/show index/i);
    });

    it("the Show all data button is visible", function () {
      cy.contains(/show all data/i);
    });
  });
});
