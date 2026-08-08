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
  await goTo(page, "Vendors");
});

/**
 * The card title for a vendor. Matching on the heading rather than bare text
 * keeps the "added to your vendors" toast out of the result.
 */
const vendorCard = (page: Page, name: string) =>
  page.getByRole("heading", { name, exact: true });

async function addVendor(
  page: Page,
  name: string,
  type: string,
  status: string,
  cost: string,
  deposit = "0",
) {
  await page.getByRole("button", { name: "Add vendor", exact: true }).click();

  const form = dialog(page);
  await form.getByLabel("Business name").fill(name);
  await chooseOption(page, "Type", type);
  await chooseOption(page, "Status", status);
  await form.getByLabel("Quoted cost").fill(cost);
  await form.getByLabel("Deposit paid").fill(deposit);
  await form.getByRole("button", { name: "Add vendor", exact: true }).click();
  await expect(form).toBeHidden();
}

test.describe("vendor directory", () => {
  test("starts empty", async ({ page }) => {
    await expect(page.getByText("No vendors yet")).toBeVisible();
    await expect(statValue(page, "Vendors")).toHaveText("0");
  });

  test("a booked vendor counts towards contracted cost and deposits", async ({
    page,
  }) => {
    await addVendor(page, "Ivy House Barn", "Venue", "Booked", "14500", "4000");

    await expect(vendorCard(page, "Ivy House Barn")).toBeVisible();
    await expect(statValue(page, "Vendors")).toHaveText("1");
    await expect(statValue(page, "Booked")).toHaveText("1");
    await expect(statValue(page, "Contracted")).toHaveText("$14,500");
    await expect(statValue(page, "Deposits paid")).toHaveText("$4,000");
    await expect(page.getByText("$10,500 outstanding")).toBeVisible();
  });

  test("a lead that is only contacted is not counted as booked", async ({
    page,
  }) => {
    await addVendor(page, "Wild Stem Florals", "Florist", "Contacted", "2400");

    await expect(statValue(page, "Booked")).toHaveText("0");
    await expect(statValue(page, "Contracted")).toHaveText("$0");
    await expect(page.getByText("1 still being chased")).toBeVisible();
  });

  test("the type filter only offers types in use", async ({ page }) => {
    await addVendor(page, "Ivy House Barn", "Venue", "Booked", "14500");
    await addVendor(page, "Saltwood Kitchen", "Catering", "Booked", "9800");

    await chooseOption(page, "Filter by vendor type", "Catering");
    await expect(vendorCard(page, "Saltwood Kitchen")).toBeVisible();
    await expect(vendorCard(page, "Ivy House Barn")).toBeHidden();

    await chooseOption(page, "Filter by vendor type", "All types");
    await page.getByLabel("Search vendors").fill("saltwood");
    await expect(vendorCard(page, "Ivy House Barn")).toBeHidden();
    await expect(vendorCard(page, "Saltwood Kitchen")).toBeVisible();
  });

  test("a vendor can be edited and deleted", async ({ page }) => {
    await addVendor(page, "Rosewater Cakes", "Cake & Desserts", "Contacted", "750");

    await page
      .getByRole("button", { name: "Actions for Rosewater Cakes" })
      .click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    await chooseOption(page, "Status", "Booked");
    await dialog(page).getByRole("button", { name: "Save changes" }).click();
    await expect(dialog(page)).toBeHidden();
    await expect(statValue(page, "Booked")).toHaveText("1");

    await page
      .getByRole("button", { name: "Actions for Rosewater Cakes" })
      .click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await dialog(page).getByRole("button", { name: "Remove vendor" }).click();

    await expect(page.getByText("No vendors yet")).toBeVisible();
  });
});
