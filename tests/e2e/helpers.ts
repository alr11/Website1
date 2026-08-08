import { expect, type APIRequestContext, type Page } from "@playwright/test";

export const MOCK_URL = `http://127.0.0.1:${process.env.MOCK_SUPABASE_PORT ?? 54321}`;

let accountCounter = 0;

/** Wipes the mock backend so a spec file starts from an empty database. */
export async function resetBackend(request: APIRequestContext) {
  await request.post(`${MOCK_URL}/__reset`);
}

/** Creates a brand-new account and lands on the first-run setup card. */
export async function signUp(page: Page) {
  accountCounter += 1;
  const email = `planner-${Date.now()}-${accountCounter}@example.com`;

  await page.goto("/signup");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("wedding-password");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText(/set up your wedding/i)).toBeVisible();
  return email;
}

export interface SetupOptions {
  partnerOne?: string;
  partnerTwo?: string;
  /** `yyyy-MM-dd`. Defaults to roughly nine months out. */
  weddingDate?: string;
  venue?: string;
  budget?: string;
}

/** Fills in the first-run setup, which seeds the checklist and the budget. */
export async function completeSetup(page: Page, options: SetupOptions = {}) {
  const {
    partnerOne = "Amelia",
    partnerTwo = "Jonah",
    weddingDate = futureDate(9),
    venue = "Ivy House Barn",
    budget = "40000",
  } = options;

  await page.getByLabel("Partner 1").fill(partnerOne);
  await page.getByLabel("Partner 2").fill(partnerTwo);
  await page.getByLabel("Wedding date").fill(weddingDate);
  await page.getByLabel("Total budget").fill(budget);
  await page.getByLabel("Venue (optional)").fill(venue);
  await page.getByRole("button", { name: "Create my planner" }).click();

  await expect(
    page.getByRole("heading", { name: new RegExp(partnerOne) }),
  ).toBeVisible();
}

/** Sign up and run setup in one step — the starting point for most specs. */
export async function signUpAndSetUp(page: Page, options: SetupOptions = {}) {
  const email = await signUp(page);
  await completeSetup(page, options);
  return email;
}

/** Picks an option from a Radix select, which is not a native `<select>`. */
export async function chooseOption(
  page: Page,
  triggerLabel: string,
  optionName: string,
) {
  await page.getByLabel(triggerLabel, { exact: true }).click();
  await page.getByRole("option", { name: optionName, exact: true }).click();
}

/** Reads the headline number out of a stat card. */
export function statValue(page: Page, label: string) {
  return page.getByTestId(`stat-${label.toLowerCase().replace(/\s+/g, "-")}`);
}

/** `yyyy-MM-dd`, the given number of months from today. */
export function futureDate(monthsAhead: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsAhead);
  return date.toISOString().slice(0, 10);
}
