import { expect, test, type Page } from "@playwright/test";

import {
  chooseOption,
  dialog,
  goTo,
  resetBackend,
  signUpAndSetUp,
  statValue,
} from "./helpers";

test.beforeAll(async ({ request }) => {
  await resetBackend(request);
});

test.beforeEach(async ({ page }) => {
  await signUpAndSetUp(page);
  await goTo(page, "Guests");
});

async function addGuest(
  page: Page,
  firstName: string,
  lastName: string,
  partySize = "1",
) {
  // The page header button is always present, empty list or not.
  await page.getByRole("button", { name: "Add guest", exact: true }).click();

  const form = dialog(page);
  await form.getByLabel("First name").fill(firstName);
  await form.getByLabel("Last name").fill(lastName);
  await form.getByLabel("Party size").fill(partySize);
  await form.getByRole("button", { name: "Add guest", exact: true }).click();
  await expect(form).toBeHidden();
}

test.describe("guest list", () => {
  test("starts empty and explains what to do", async ({ page }) => {
    await expect(page.getByText("No guests yet")).toBeVisible();
    await expect(statValue(page, "Invited")).toHaveText("0");
  });

  test("adding a guest updates the table and the head counts", async ({
    page,
  }) => {
    await addGuest(page, "Wren", "Castellan", "2");

    await expect(page.getByRole("cell", { name: "Wren Castellan" })).toBeVisible();
    // Party size counts towards "invited", not just the row count.
    await expect(statValue(page, "Invited")).toHaveText("2");
    await expect(statValue(page, "Awaiting reply")).toHaveText("2");
    await expect(statValue(page, "Attending")).toHaveText("0");
  });

  test("changing the RSVP inline moves the head count", async ({ page }) => {
    await addGuest(page, "Ida", "Fenwick", "2");

    await chooseOption(page, "RSVP for Ida", "Attending");

    await expect(statValue(page, "Attending")).toHaveText("2");
    await expect(statValue(page, "Awaiting reply")).toHaveText("0");
  });

  test("search and RSVP filter narrow the list", async ({ page }) => {
    await addGuest(page, "Ada", "Bramble");
    await addGuest(page, "Otto", "Speight");
    await chooseOption(page, "RSVP for Otto", "Declined");

    await page.getByLabel("Search guests").fill("bramble");
    await expect(page.getByRole("row")).toHaveCount(2); // header + Ada
    await expect(page.getByRole("cell", { name: "Ada Bramble" })).toBeVisible();

    await page.getByLabel("Search guests").fill("");
    await chooseOption(page, "Filter by RSVP", "Declined");
    await expect(page.getByRole("cell", { name: "Otto Speight" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Ada Bramble" })).toBeHidden();

    await page.getByLabel("Search guests").fill("nobody-by-this-name");
    await expect(page.getByText("No matches")).toBeVisible();
  });

  test("editing a guest saves seating and dietary details", async ({ page }) => {
    await addGuest(page, "Cassian", "Vale");

    await page.getByRole("button", { name: "Row actions" }).first().click();
    await page.getByRole("menuitem", { name: "Edit" }).click();

    const form = dialog(page);
    await form.getByLabel("Table").fill("Head table");
    await form.getByLabel("Dietary needs").fill("Coeliac");
    await form.getByRole("button", { name: "Save changes" }).click();
    await expect(form).toBeHidden();

    await expect(page.getByRole("cell", { name: "Head table" })).toBeVisible();
    await expect(statValue(page, "Seated")).toHaveText("1/1");
  });

  test("deleting a guest asks first, then removes them", async ({ page }) => {
    await addGuest(page, "Marlowe", "Quist");

    await page.getByRole("button", { name: "Row actions" }).first().click();
    await page.getByRole("menuitem", { name: "Delete" }).click();

    await expect(page.getByText("Remove this guest?")).toBeVisible();
    await page.getByRole("button", { name: "Remove guest" }).click();

    await expect(page.getByText("No guests yet")).toBeVisible();
    await expect(statValue(page, "Invited")).toHaveText("0");
  });
});
