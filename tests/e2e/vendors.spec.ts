import { expect, test } from "@playwright/test";

import {
  chooseOption,
  resetBackend,
  signUpAndSetUp,
  statValue,
} from "./helpers";

test.beforeAll(async ({ request }) => {
  await resetBackend(request);
});

test.beforeEach(async ({ page }) => {
  await signUpAndSetUp(page);
  await page.getByRole("link", { name: "Vendors" }).click();
  await expect(page.getByRole("heading", { name: "Vendors" })).toBeVisible();
});

async function addVendor(
  page: import("@playwright/test").Page,
  name: string,
  type: string,
  status: string,
  cost: string,
  deposit = "0",
) {
  await page.getByRole("button", { name: /Add (your first )?vendor/ }).click();
  await page.getByLabel("Business name").fill(name);
  await chooseOption(page, "Type", type);
  await chooseOption(page, "Status", status);
  await page.getByLabel("Quoted cost").fill(cost);
  await page.getByLabel("Deposit paid").fill(deposit);
  await page.getByRole("button", { name: "Add vendor", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
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

    await expect(page.getByText("Ivy House Barn")).toBeVisible();
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
    await expect(page.getByText("2 still being chased")).toBeHidden();
    await expect(page.getByText("1 still being chased")).toBeVisible();
  });

  test("the type filter only offers types in use", async ({ page }) => {
    await addVendor(page, "Ivy House Barn", "Venue", "Booked", "14500");
    await addVendor(page, "Saltwood Kitchen", "Catering", "Booked", "9800");

    await chooseOption(page, "Filter by vendor type", "Catering");
    await expect(page.getByText("Saltwood Kitchen")).toBeVisible();
    await expect(page.getByText("Ivy House Barn")).toBeHidden();

    await chooseOption(page, "Filter by vendor type", "All types");
    await page.getByLabel("Search vendors").fill("saltwood");
    await expect(page.getByText("Ivy House Barn")).toBeHidden();
  });

  test("a vendor can be edited and deleted", async ({ page }) => {
    await addVendor(page, "Rosewater Cakes", "Cake & Desserts", "Contacted", "750");

    await page
      .getByRole("button", { name: "Actions for Rosewater Cakes" })
      .click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    await chooseOption(page, "Status", "Booked");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(statValue(page, "Booked")).toHaveText("1");

    await page
      .getByRole("button", { name: "Actions for Rosewater Cakes" })
      .click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Remove vendor" }).click();

    await expect(page.getByText("No vendors yet")).toBeVisible();
  });
});
