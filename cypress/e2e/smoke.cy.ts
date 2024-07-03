import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register and login", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/");

    cy.findByRole("link", { name: /sign up/i }).click();

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /create account/i }).click();

    cy.findByRole("link", { name: /vendors/i }).click();
    cy.findByRole("button", { name: /logout/i }).click();
    cy.findByRole("link", { name: /log in/i });
  });

  it("should allow you to add a vendor", () => {
    const testVendor = {
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
    };
    cy.login();

    cy.visitAndCheck("/");

    cy.findByRole("link", { name: /vendors/i }).click();
    cy.findByText("No vendors yet");

    cy.findByRole("link", { name: /\+ new vendor/i }).click();

    cy.findByRole("textbox", { name: /name/i }).type(testVendor.name);
    cy.findByRole("textbox", { name: /description/i }).type(testVendor.description);
    cy.findByRole("button", { name: /save/i }).click();

    cy.findByRole("button", { name: /delete/i }).click();

    cy.findByText("No vendors yet");
  });
});
