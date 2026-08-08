import { devices, expect, test } from "@playwright/test";

import { dialog, pageHeading, resetBackend, signUpAndSetUp } from "./helpers";

test.use({ ...devices["Pixel 7"] });

test.beforeAll(async ({ request }) => {
  await resetBackend(request);
});

test.describe("mobile layout", () => {
  test("the sidebar becomes a sheet that navigates and closes", async ({
    page,
  }) => {
    await signUpAndSetUp(page);

    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Budget", exact: true })
      .click();

    await expect(pageHeading(page, "Budget")).toBeVisible();
    await expect(dialog(page)).toBeHidden();
  });

  test("the guest table collapses into cards", async ({ page }) => {
    await signUpAndSetUp(page);

    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Guests", exact: true })
      .click();
    await expect(pageHeading(page, "Guests")).toBeVisible();

    await page.getByRole("button", { name: "Add guest", exact: true }).click();
    const form = dialog(page);
    await form.getByLabel("First name").fill("Wren");
    await form.getByLabel("Last name").fill("Castellan");
    await form.getByRole("button", { name: "Add guest", exact: true }).click();
    await expect(form).toBeHidden();

    // The card list renders; the table is still in the DOM but hidden by the
    // md: breakpoint, so scope the assertion to the card list.
    await expect(
      page.getByRole("listitem").filter({ hasText: "Wren Castellan" }),
    ).toBeVisible();
    await expect(page.getByRole("cell", { name: "Wren Castellan" })).toBeHidden();
    await expect(page.getByText(/Party of 1/)).toBeVisible();
  });

  test("no page scrolls sideways", async ({ page }) => {
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
