import { devices, expect, test } from "@playwright/test";

import { resetBackend, signUpAndSetUp } from "./helpers";

test.use({ ...devices["Pixel 7"] });

test.beforeAll(async ({ request }) => {
  await resetBackend(request);
});

test.describe("mobile layout", () => {
  test("the sidebar becomes a sheet that navigates and closes", async ({
    page,
  }) => {
    await signUpAndSetUp(page);

    // The desktop sidebar links are not reachable at this width.
    await expect(page.getByRole("button", { name: "Open navigation" })).toBeVisible();

    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("link", { name: "Budget" }).click();

    await expect(page.getByRole("heading", { name: "Budget" })).toBeVisible();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("the guest table collapses into cards", async ({ page }) => {
    await signUpAndSetUp(page);

    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("link", { name: "Guests" }).click();

    await page.getByRole("button", { name: /Add (your first )?guest/ }).click();
    await page.getByLabel("First name").fill("Wren");
    await page.getByLabel("Last name").fill("Castellan");
    await page.getByRole("button", { name: "Add guest", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Card list is shown, the table is hidden by the md: breakpoint.
    await expect(page.getByText("Wren Castellan")).toBeVisible();
    await expect(page.getByRole("cell", { name: "Wren Castellan" })).toBeHidden();
    await expect(page.getByText(/Party of 1/)).toBeVisible();
  });

  test("the page never scrolls sideways", async ({ page }) => {
    await signUpAndSetUp(page);

    for (const path of ["/", "/guests", "/budget", "/timeline", "/vendors"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, `${path} overflows horizontally`).toBeLessThanOrEqual(1);
    }
  });
});
