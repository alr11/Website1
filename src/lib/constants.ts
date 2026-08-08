import type {
  GuestSide,
  RsvpStatus,
  TimelinePhase,
  VendorStatus,
} from "@/lib/types";

/* -------------------------------------------------------------------------- */
/* Guests                                                                     */
/* -------------------------------------------------------------------------- */

export const RSVP_STATUSES: {
  value: RsvpStatus;
  label: string;
  /** Tailwind classes for the badge that renders this status. */
  className: string;
}[] = [
  {
    value: "pending",
    label: "Awaiting reply",
    className: "bg-muted text-muted-foreground border-border",
  },
  {
    value: "yes",
    label: "Attending",
    className: "bg-sage-100 text-sage-700 border-sage-200",
  },
  {
    value: "maybe",
    label: "Maybe",
    className: "bg-champagne-100 text-champagne-700 border-champagne-200",
  },
  {
    value: "no",
    label: "Declined",
    className: "bg-blush-100 text-blush-700 border-blush-200",
  },
];

export const GUEST_SIDES: { value: GuestSide; label: string }[] = [
  { value: "partner_one", label: "Partner 1" },
  { value: "partner_two", label: "Partner 2" },
  { value: "both", label: "Both" },
];

export const GUEST_ROLES = [
  "Guest",
  "Maid of Honour",
  "Best Man",
  "Bridesmaid",
  "Groomsman",
  "Flower Girl",
  "Ring Bearer",
  "Officiant",
  "Parent",
  "Grandparent",
  "Reader",
  "Usher",
] as const;

/* -------------------------------------------------------------------------- */
/* Vendors                                                                    */
/* -------------------------------------------------------------------------- */

export const VENDOR_TYPES = [
  "Venue",
  "Catering",
  "Photography",
  "Videography",
  "Florist",
  "Music / DJ",
  "Band",
  "Cake & Desserts",
  "Hair & Makeup",
  "Attire",
  "Stationery",
  "Transport",
  "Officiant",
  "Rentals",
  "Planner",
  "Other",
] as const;

export const VENDOR_STATUSES: {
  value: VendorStatus;
  label: string;
  className: string;
}[] = [
  {
    value: "researching",
    label: "Researching",
    className: "bg-muted text-muted-foreground border-border",
  },
  {
    value: "contacted",
    label: "Contacted",
    className: "bg-champagne-100 text-champagne-700 border-champagne-200",
  },
  {
    value: "booked",
    label: "Booked",
    className: "bg-sage-100 text-sage-700 border-sage-200",
  },
  {
    value: "declined",
    label: "Declined",
    className: "bg-blush-100 text-blush-700 border-blush-200",
  },
];

/* -------------------------------------------------------------------------- */
/* Budget                                                                     */
/* -------------------------------------------------------------------------- */

/** Seeded for a new account, with the share of budget each category usually takes. */
export const DEFAULT_BUDGET_CATEGORIES: {
  name: string;
  /** Fraction of the total budget. */
  share: number;
}[] = [
  { name: "Venue & Rentals", share: 0.3 },
  { name: "Catering & Bar", share: 0.22 },
  { name: "Photography & Video", share: 0.12 },
  { name: "Flowers & Décor", share: 0.08 },
  { name: "Music & Entertainment", share: 0.08 },
  { name: "Attire & Beauty", share: 0.07 },
  { name: "Cake & Desserts", share: 0.03 },
  { name: "Stationery", share: 0.03 },
  { name: "Transport", share: 0.03 },
  { name: "Rings", share: 0.04 },
];

/* -------------------------------------------------------------------------- */
/* Timeline                                                                   */
/* -------------------------------------------------------------------------- */

export const TIMELINE_PHASES: {
  value: TimelinePhase;
  label: string;
  description: string;
  /** Months before the wedding, used to derive a due date from the big day. */
  monthsBefore: number;
}[] = [
  {
    value: "12_months",
    label: "12+ months out",
    description: "The big decisions — date, budget, venue.",
    monthsBefore: 12,
  },
  {
    value: "9_months",
    label: "9 months out",
    description: "Lock in the vendors that book up first.",
    monthsBefore: 9,
  },
  {
    value: "6_months",
    label: "6 months out",
    description: "Details, tastings and the guest list.",
    monthsBefore: 6,
  },
  {
    value: "3_months",
    label: "3 months out",
    description: "Invitations out, numbers firming up.",
    monthsBefore: 3,
  },
  {
    value: "1_month",
    label: "1 month out",
    description: "Confirm everything, chase the stragglers.",
    monthsBefore: 1,
  },
  {
    value: "1_week",
    label: "1 week out",
    description: "Final counts, packing, rehearsal.",
    monthsBefore: 0.25,
  },
  {
    value: "day_of",
    label: "Day of",
    description: "Get married. Everything else is handled.",
    monthsBefore: 0,
  },
  {
    value: "after",
    label: "After the wedding",
    description: "Thank-yous, returns and paperwork.",
    monthsBefore: -1,
  },
];

export const TIMELINE_PHASE_LABELS: Record<TimelinePhase, string> =
  TIMELINE_PHASES.reduce(
    (acc, phase) => ({ ...acc, [phase.value]: phase.label }),
    {} as Record<TimelinePhase, string>,
  );

/** The checklist every new account starts with. */
export const DEFAULT_TIMELINE_TASKS: {
  phase: TimelinePhase;
  title: string;
  notes?: string;
}[] = [
  // 12+ months
  { phase: "12_months", title: "Agree on an overall budget" },
  { phase: "12_months", title: "Draft the guest list", notes: "A rough headcount drives every other decision." },
  { phase: "12_months", title: "Choose a season and a few candidate dates" },
  { phase: "12_months", title: "Tour venues and book the ceremony site" },
  { phase: "12_months", title: "Book the reception venue" },
  { phase: "12_months", title: "Decide on the overall style and colour palette" },
  { phase: "12_months", title: "Insure the wedding" },

  // 9 months
  { phase: "9_months", title: "Book the photographer" },
  { phase: "9_months", title: "Book the videographer" },
  { phase: "9_months", title: "Book the caterer", notes: "Ask about dietary requirements and staffing." },
  { phase: "9_months", title: "Book the band or DJ" },
  { phase: "9_months", title: "Shop for wedding attire" },
  { phase: "9_months", title: "Reserve a room block for out-of-town guests" },
  { phase: "9_months", title: "Send save-the-dates" },
  { phase: "9_months", title: "Book the officiant" },

  // 6 months
  { phase: "6_months", title: "Book the florist" },
  { phase: "6_months", title: "Order the wedding cake" },
  { phase: "6_months", title: "Arrange guest and wedding-party transport" },
  { phase: "6_months", title: "Choose and order invitations" },
  { phase: "6_months", title: "Book hair and makeup, schedule a trial" },
  { phase: "6_months", title: "Plan the honeymoon and check passports" },
  { phase: "6_months", title: "Register for gifts" },
  { phase: "6_months", title: "Order bridesmaid and groomsman attire" },

  // 3 months
  { phase: "3_months", title: "Finalise the menu with the caterer" },
  { phase: "3_months", title: "Mail the invitations", notes: "Set the RSVP deadline 4 weeks before the day." },
  { phase: "3_months", title: "Write the vows" },
  { phase: "3_months", title: "Buy the wedding rings" },
  { phase: "3_months", title: "Book the rehearsal-dinner venue" },
  { phase: "3_months", title: "Order favours and signage" },
  { phase: "3_months", title: "Schedule the dress fitting" },
  { phase: "3_months", title: "Apply for the marriage licence" },

  // 1 month
  { phase: "1_month", title: "Chase outstanding RSVPs" },
  { phase: "1_month", title: "Build the seating chart" },
  { phase: "1_month", title: "Confirm the timeline with every vendor" },
  { phase: "1_month", title: "Print place cards and menus" },
  { phase: "1_month", title: "Final dress fitting" },
  { phase: "1_month", title: "Pay remaining vendor balances" },
  { phase: "1_month", title: "Write the day-of schedule for the wedding party" },

  // 1 week
  { phase: "1_week", title: "Give the final headcount to the caterer" },
  { phase: "1_week", title: "Pack for the wedding night and honeymoon" },
  { phase: "1_week", title: "Prepare vendor tips in labelled envelopes" },
  { phase: "1_week", title: "Confirm hair and makeup call times" },
  { phase: "1_week", title: "Run the rehearsal" },
  { phase: "1_week", title: "Delegate day-of tasks to a point person" },

  // Day of
  { phase: "day_of", title: "Eat breakfast" },
  { phase: "day_of", title: "Hand the rings to the best man or ring bearer" },
  { phase: "day_of", title: "Bring the marriage licence to the ceremony" },
  { phase: "day_of", title: "Hand out the vendor tips" },
  { phase: "day_of", title: "Get married" },

  // After
  { phase: "after", title: "Return rentals and suits" },
  { phase: "after", title: "Send thank-you notes" },
  { phase: "after", title: "Order the wedding album" },
  { phase: "after", title: "Update names and legal documents" },
  { phase: "after", title: "Preserve the dress and bouquet" },
];
