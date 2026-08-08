import { expect, test } from "@playwright/test";

import { completeSetup, pageHeading, resetBackend, signUp } from "./helpers";

test.beforeAll(async ({ request }) => {
  await resetBackend(request);
});

test.describe("authentication", () => {
  test("signed-out visitors are sent to the login page", async ({ page }) => {
    await page.goto("/guests");

    // The redirectTo parameter only survives if the middleware is running.
    await expect(page).toHaveURL(/\/login\?redirectTo=%2Fguests/);
    await expect(pageHeading(page, "Welcome back")).toBeVisible();
  });

  test("wrong credentials surface an inline error, not a crash", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("nobody@example.com");
    await page.getByLabel("Password").fill("not-the-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByTestId("auth-error")).toContainText(
      /invalid login credentials/i,
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test("a new account lands on first-run setup", async ({ page }) => {
    await signUp(page);

    await expect(page.getByText(/set up your wedding/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Create my planner" }),
    ).toBeVisible();
  });

  test("sign in, sign out, and the session is really gone", async ({ page }) => {
    const email = await signUp(page);
    await completeSetup(page);

    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByRole("menuitem", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/login/);

    // A protected route must bounce us straight back out.
    await page.goto("/budget");
    await expect(page).toHaveURL(/\/login/);

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("wedding-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Signing back in returns to the page that bounced us, not the dashboard.
    await expect(page).toHaveURL(/\/budget$/);
    await expect(pageHeading(page, "Budget")).toBeVisible();
  });

  test("signed-in visitors are redirected away from the auth pages", async ({
    page,
  }) => {
    await signUp(page);
    await completeSetup(page);

    await page.goto("/login");

    await expect(page).toHaveURL(/:\d+\/$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Amelia/ }),
    ).toBeVisible();
  });
});
