import { expect, test } from "@playwright/test";

import { resetBackend, signUpAndSetUp, statValue } from "./helpers";

test.beforeAll(async ({ request }) => {
  await resetBackend(request);
});

test.beforeEach(async ({ page }) => {
  await signUpAndSetUp(page, { budget: "40000" });
  await page.getByRole("link", { name: "Budget" }).click();
  await expect(page.getByRole("heading", { name: "Budget" })).toBeVisible();
});

async function logExpense(
  page: import("@playwright/test").Page,
  description: string,
  amount: string,
  { paid = false }: { paid?: boolean } = {},
) {
  await page.getByRole("button", { name: "Expense", exact: true }).click();
  await page.getByLabel("Description").fill(description);
  await page.getByLabel("Amount").fill(amount);
  if (paid) await page.getByLabel("Already paid").click();
  await page.getByRole("button", { name: "Log expense" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
}

test.describe("budget", () => {
  test("seeded categories split the total budget", async ({ page }) => {
    await expect(statValue(page, "Total budget")).toHaveText("$40,000");
    await expect(statValue(page, "Spent")).toHaveText("$0");
    await expect(statValue(page, "Left to spend")).toHaveText("$40,000");
    await expect(page.getByText("Venue & Rentals")).toBeVisible();
    await expect(page.getByText("Catering & Bar")).toBeVisible();
  });

  test("logging an unpaid expense moves spent and still-owed", async ({
    page,
  }) => {
    await logExpense(page, "Venue deposit", "5000");

    await expect(statValue(page, "Spent")).toHaveText("$5,000");
    await expect(statValue(page, "Left to spend")).toHaveText("$35,000");
    await expect(statValue(page, "Still owed")).toHaveText("$5,000");
  });

  test("marking an expense paid clears it from still-owed", async ({ page }) => {
    await logExpense(page, "Photographer retainer", "1200");
    await expect(statValue(page, "Still owed")).toHaveText("$1,200");

    await page.getByRole("tab", { name: /Expenses/ }).click();
    await page
      .getByRole("checkbox", { name: "Mark Photographer retainer paid" })
      .click();

    await expect(statValue(page, "Still owed")).toHaveText("$0");
    await expect(statValue(page, "Spent")).toHaveText("$1,200");
  });

  test("uncategorised spending is called out", async ({ page }) => {
    await logExpense(page, "Miscellaneous bits", "300");

    await expect(
      page.getByText(/\$300 of spending is not assigned to a category/),
    ).toBeVisible();
  });

  test("a custom category can be added and deleted", async ({ page }) => {
    await page.getByRole("button", { name: "Category" }).click();
    await page.getByLabel("Name").fill("Honeymoon fund");
    await page.getByLabel("Allocated").fill("2500");
    await page.getByRole("button", { name: "Add category" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    await expect(page.getByText("Honeymoon fund")).toBeVisible();
    await expect(statValue(page, "Total budget")).toHaveText("$40,000");

    await page
      .getByRole("button", { name: "Actions for Honeymoon fund" })
      .click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(page.getByText("Honeymoon fund")).toBeHidden();
  });

  test("going over a category allocation is shown as over, not negative", async ({
    page,
  }) => {
    await page
      .getByRole("button", { name: "Actions for Stationery" })
      .click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    await page.getByLabel("Allocated").fill("500");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    await page.getByRole("button", { name: "Add expense to Stationery" }).click();
    await page.getByLabel("Description").fill("Letterpress invitations");
    await page.getByLabel("Amount").fill("800");
    await page.getByRole("button", { name: "Log expense" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    await expect(page.getByText("$300 over")).toBeVisible();
  });
});
