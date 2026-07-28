import { expect, test } from "@playwright/test";

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

const loginAsAdmin = async (page) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
};

test.describe("Client workflow", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !email || !password,
      "Set E2E_EMAIL and E2E_PASSWORD before running authenticated E2E tests.",
    );

    await loginAsAdmin(page);
  });

  test("navigates from dashboard to the Clients workspace", async ({ page }) => {
    await page.getByRole("link", { name: "Clients" }).click();

    await expect(page).toHaveURL(/\/clients$/);
    await expect(page.getByRole("heading", { name: "Clients" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Register client" }),
    ).toBeVisible();
  });

  test("registers a new client through the UI", async ({ page }) => {
    test.skip(
      process.env.E2E_RUN_WRITE_TESTS !== "true",
      "Set E2E_RUN_WRITE_TESTS=true to allow this test to create a client.",
    );

    const runId = Date.now();
    const testEmail = `e2e.client.${runId}@example.test`;

    await page.goto("/clients");
    await page.getByPlaceholder("Name").fill("E2E");
    await page.getByPlaceholder("Surname").fill("Client");
    await page.getByPlaceholder("Personal number").fill(`e2e-${runId}`);
    await page.locator('select[name="gender"]').selectOption("Female");
    await page.getByPlaceholder("City").fill("Prishtina");
    await page.getByPlaceholder("Email").fill(testEmail);
    await page.locator('input[name="date_of_birth"]').fill("1998-05-10");
    await page.getByPlaceholder("Phone number").fill("+38344111222");
    await page.getByPlaceholder("Nationality").fill("Kosovar");
    await page.getByRole("button", { name: "Register client" }).click();

    await expect(page.getByText("Client registered.")).toBeVisible();
    await expect(page.getByText(testEmail)).toBeVisible();
  });
});
