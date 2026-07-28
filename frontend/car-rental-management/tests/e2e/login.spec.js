import { expect, test } from "@playwright/test";


const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

test.describe("Login", () => {
  const loginAsAdmin = async (page) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  };

  test("logs in with valid administrator credentials", async ({ page }) => {
    test.skip(
      !email || !password,
      "Set E2E_EMAIL and E2E_PASSWORD before running the real login flow.",
    );

    await loginAsAdmin(page);
  });

});
