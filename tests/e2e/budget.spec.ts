import { expect, test, type Page } from "@playwright/test";

import { dialog, goTo, resetBackend, signUpAndSetUp, statValue } from "./helpers";

test.beforeAll(async ({ request }) => {
  await resetBackend(request);
});

test.beforeEach(async ({ page }) => {
  await signUpAndSetUp(page, { budget: "40000" });
  await goTo(page, "Budget");
});

async function logExpense(
  page: Page,
  description: string,
  amount: string,
  { paid = false }: { paid?: boolean } = {},
) {
  await page.getByRole("button", { name: "Expense", exact: true }).click();

  const form = dialog(page);
  await form.getByLabel("Description").fill(description);
  await form.getByLabel("Amount").fill(amount);
  if (paid) await form.getByLabel("Already paid").click();
  await form.getByRole("button", { name: "Log expense" }).click();
  await expect(form).toBeHidden();
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
      .getByRole("checkbox", {
        name: "Mark Photographer retainer paid",
        exact: true,
      })
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
    await page.getByRole("button", { name: "Category", exact: true }).click();

    const form = dialog(page);
    await form.getByLabel("Name").fill("Honeymoon fund");
    await form.getByLabel("Allocated").fill("2500");
    await form.getByRole("button", { name: "Add category" }).click();
    await expect(form).toBeHidden();

    await expect(page.getByText("Honeymoon fund")).toBeVisible();
    // The total budget is a separate figure — categories do not change it.
    await expect(statValue(page, "Total budget")).toHaveText("$40,000");

    await page
      .getByRole("button", { name: "Actions for Honeymoon fund" })
      .click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await dialog(page).getByRole("button", { name: "Delete", exact: true }).click();

    await expect(page.getByText("Honeymoon fund")).toBeHidden();
  });

  test("going over a category allocation reads as over, not negative", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Actions for Stationery" }).click();
    await page.getByRole("menuitem", { name: "Edit" }).click();

    const categoryForm = dialog(page);
    await categoryForm.getByLabel("Allocated").fill("500");
    await categoryForm.getByRole("button", { name: "Save changes" }).click();
    await expect(categoryForm).toBeHidden();

    await page.getByRole("button", { name: "Add expense to Stationery" }).click();
    const expenseForm = dialog(page);
    await expenseForm.getByLabel("Description").fill("Letterpress invitations");
    await expenseForm.getByLabel("Amount").fill("800");
    await expenseForm.getByRole("button", { name: "Log expense" }).click();
    await expect(expenseForm).toBeHidden();

    await expect(page.getByText("$300 over")).toBeVisible();
  });
});
