import { expect, test } from "@playwright/test";

import {
  chooseOption,
  dialog,
  goTo,
  resetBackend,
  signUpAndSetUp,
} from "./helpers";

test.beforeAll(async ({ request }) => {
  await resetBackend(request);
});

test.beforeEach(async ({ page }) => {
  await signUpAndSetUp(page);
  await goTo(page, "Checklist");
});

/** Checklist checkboxes are labelled `Mark "<title>" complete`. */
const taskBox = (page: import("@playwright/test").Page, title: string) =>
  page.getByRole("checkbox", { name: `Mark "${title}" complete`, exact: true });

test.describe("checklist", () => {
  test("ticking a task moves the progress bar and the phase count", async ({
    page,
  }) => {
    await expect(page.getByText("0% complete")).toBeVisible();
    await expect(page.getByText("0/7").first()).toBeVisible();

    await taskBox(page, "Agree on an overall budget").click();

    await expect(page.getByText("2% complete")).toBeVisible();
    await expect(page.getByText("53 tasks still to do")).toBeVisible();
    await expect(page.getByText("1/7").first()).toBeVisible();
  });

  test("completion survives a reload", async ({ page }) => {
    await taskBox(page, "Draft the guest list").click();
    await expect(page.getByText("2% complete")).toBeVisible();

    await page.reload();
    await expect(taskBox(page, "Draft the guest list")).toBeChecked();
  });

  test("the to-do and done filters split the list", async ({ page }) => {
    await taskBox(page, "Insure the wedding").click();
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

    const form = dialog(page);
    await form.getByLabel("Task", { exact: true }).fill("Book the string quartet");
    await chooseOption(page, "Phase", "3 months out");
    await form.getByLabel("Notes").fill("Ask about a ceremony-only package");
    await form.getByRole("button", { name: "Add task", exact: true }).click();
    await expect(form).toBeHidden();

    await expect(page.getByText("Book the string quartet")).toBeVisible();
    await expect(page.getByText("55 tasks still to do")).toBeVisible();

    await page
      .getByRole("button", { name: "Actions for Book the string quartet" })
      .click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await dialog(page).getByRole("button", { name: "Remove task" }).click();

    await expect(page.getByText("Book the string quartet")).toBeHidden();
    await expect(page.getByText("54 tasks still to do")).toBeVisible();
  });
});
