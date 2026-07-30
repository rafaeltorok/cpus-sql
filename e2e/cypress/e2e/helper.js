export function fillForm(cpu) {
  cy.contains(/add processor/i).click();

  // NOTE: Ensure the input is visible and enabled before typing
  // Cypress throws an error if you try to type into a disabled element, so we assert 'not.be.disabled' first
  cy.get("#manufacturer").should("be.visible").and("not.be.disabled");

  // Helper function to fill each field
  const fillInputField = (fieldName, data) => {
    cy.get(fieldName).type(String(data));
  };

  // Fill each input on the form
  fillInputField("#manufacturer", cpu.manufacturer);
  fillInputField("#model", cpu.model);
  fillInputField("#cores", cpu.cores);
  fillInputField("#threads", cpu.threads);
  fillInputField("#cache", cpu.cache);
  fillInputField("#baseclock", cpu.baseclock);
  fillInputField("#boostclock", cpu.boostclock);
  fillInputField("#architecture", cpu.architecture);
  fillInputField("#mbsocket", cpu.mbsocket);
  fillInputField("#tdp", cpu.tdp);
}

export function showCpuData(cpuName) {
  cy.contains(cpuName).closest("table").find("button").contains("Show").click();
}

export function checkRowData(rowName, data) {
  cy.get(".cpu-data-table tbody tr th")
    .contains(rowName)
    .then(() => {
      cy.get(".cpu-data-table tbody tr td").contains(data);
    });
}

export function indexSelector(itemName) {
  cy.get(".index-list li")
    .contains(itemName) // Select based on text
    .click();

  cy.get(".cpu-data-table").should("be.visible");

  cy.get(".cpu-data-table").should("contain", itemName);
}
