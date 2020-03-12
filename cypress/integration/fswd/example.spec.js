it("should visit the test site", function() {
    // cy.server();
    // cy.route({ url: "/check-login", status: 404, response: {} });
    // cy.route("/tasks", []);
    cy.visit("http://localhost:8888");
    cy.contains("This is Base");

    cy.contains("/tasks/add").click();
    cy.get("input").type("This is my new task");
    cy.get("button").click();
    cy.contains("/tasks").click();
});
