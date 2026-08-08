import { expect, test } from "@playwright/test";

import { chooseOption, resetBackend, signUpAndSetUp } from "./helpers";

test.beforeAll(async ({ request }) => {
  await resetBackend(request);
});

test.beforeEach(async ({ page }) => {
  await signUpAndSetUp(page);
  await page.getByRole("link", { name: "Checklist" }).click();
  await expect(page.getByRole("heading", { name: "Checklist" })).toBeVisible();
});

test.describe("checklist", () => {
  test("ticking a task moves the progress bar and the phase count", async ({
    page,
  }) => {
    await expect(page.getByText("0% complete")).toBeVisible();
    await expect(page.getByText("0/7").first()).toBeVisible();

    await page
      .getByRole("checkbox", { name: 'Mark "Agree on an overall budget" complete' })
      .click();

    await expect(page.getByText("2% complete")).toBeVisible();
    await expect(page.getByText("53 tasks still to do")).toBeVisible();
    await expect(page.getByText("1/7").first()).toBeVisible();
  });

  test("completion survives a reload", async ({ page }) => {
    await page
      .getByRole("checkbox", { name: 'Mark "Draft the guest list" complete' })
      .click();
    await expect(page.getByText("2% complete")).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("checkbox", { name: 'Mark "Draft the guest list" complete' }),
    ).toBeChecked();
  });

  test("the to-do and done filters split the list", async ({ page }) => {
    await page
      .getByRole("checkbox", { name: 'Mark "Insure the wedding" complete' })
      .click();
    await expect(page.getByText("2% complete")).toBeVisible();

    await page.getByRole("tab", { name: "Done" }).click();
    await expect(page.getByText("Insure the wedding")).toBeVisible();
    await expect(page.getByText("Agree on an overall budget")).toBeHidden();

    await page.getByRole("tab", { name: "To do" }).click();
    await expect(page.getByText("Insure the wedding")).toBeHidden();
    await expect(page.getByText("Agree on an overall budget")).toBeVisible();
  });

  test("a custom task can be added to a phase and removed", async ({ page }) => {
    await page.getByRole("button", { name: "Add task", exact: true }).click();
    await page.getByLabel("Task").fill("Book the string quartet");
    await chooseOption(page, "Phase", "3 months out");
    await page.getByLabel("Notes").fill("Ask about a ceremony-only package");
    await page.getByRole("button", { name: "Add task", exact: true }).last().click();
    await expect(page.getByRole("dialog")).toBeHidden();

    await expect(page.getByText("Book the string quartet")).toBeVisible();
    await expect(page.getByText("55 tasks still to do")).toBeVisible();

    await page
      .getByRole("button", { name: "Actions for Book the string quartet" })
      .click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Remove task" }).click();

    await expect(page.getByText("Book the string quartet")).toBeHidden();
    await expect(page.getByText("54 tasks still to do")).toBeVisible();
  });
});
