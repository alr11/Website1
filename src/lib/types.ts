/**
 * Hand-written mirror of `supabase/migrations/0001_init.sql`.
 *
 * If you change the SQL schema, regenerate this file with:
 *   npx supabase gen types typescript --project-id <ref> > src/lib/types.ts
 */

export type RsvpStatus = "pending" | "yes" | "no" | "maybe";
export type GuestSide = "partner_one" | "partner_two" | "both";
export type VendorStatus = "researching" | "contacted" | "booked" | "declined";
export type TimelinePhase =
  | "12_months"
  | "9_months"
  | "6_months"
  | "3_months"
  | "1_month"
  | "1_week"
  | "day_of"
  | "after";

export type WeddingSettings = {
  user_id: string;
  partner_one_name: string;
  partner_two_name: string;
  wedding_date: string | null;
  venue_name: string | null;
  total_budget: number;
  created_at: string;
  updated_at: string;
}

export type Guest = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  rsvp_status: RsvpStatus;
  party_size: number;
  side: GuestSide;
  role: string | null;
  table_number: string | null;
  dietary_notes: string | null;
  notes: string | null;
  created_at: string;
}

export type BudgetCategory = {
  id: string;
  user_id: string;
  name: string;
  allocated: number;
  sort_order: number;
  created_at: string;
}

export type Expense = {
  id: string;
  user_id: string;
  category_id: string | null;
  vendor_id: string | null;
  description: string;
  amount: number;
  paid: boolean;
  due_date: string | null;
  created_at: string;
}

export type Vendor = {
  id: string;
  user_id: string;
  name: string;
  vendor_type: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  estimated_cost: number;
  deposit_paid: number;
  status: VendorStatus;
  notes: string | null;
  created_at: string;
}

export type TimelineTask = {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  phase: TimelinePhase;
  due_date: string | null;
  completed: boolean;
  completed_at: string | null;
  sort_order: number;
  created_at: string;
}

type Mutable<T> = Omit<T, "id" | "user_id" | "created_at">;

export type Database = {
  public: {
    Tables: {
      wedding_settings: {
        Row: WeddingSettings;
        Insert: Partial<WeddingSettings> & { user_id: string };
        Update: Partial<WeddingSettings>;
        Relationships: [];
      };
      guests: {
        Row: Guest;
        Insert: Partial<Mutable<Guest>> & {
          user_id: string;
          first_name: string;
          last_name: string;
        };
        Update: Partial<Mutable<Guest>>;
        Relationships: [];
      };
      budget_categories: {
        Row: BudgetCategory;
        Insert: Partial<Mutable<BudgetCategory>> & {
          user_id: string;
          name: string;
        };
        Update: Partial<Mutable<BudgetCategory>>;
        Relationships: [];
      };
      expenses: {
        Row: Expense;
        Insert: Partial<Mutable<Expense>> & {
          user_id: string;
          description: string;
          amount: number;
        };
        Update: Partial<Mutable<Expense>>;
        Relationships: [];
      };
      vendors: {
        Row: Vendor;
        Insert: Partial<Mutable<Vendor>> & {
          user_id: string;
          name: string;
          vendor_type: string;
        };
        Update: Partial<Mutable<Vendor>>;
        Relationships: [];
      };
      timeline_tasks: {
        Row: TimelineTask;
        Insert: Partial<Mutable<TimelineTask>> & {
          user_id: string;
          title: string;
          phase: TimelinePhase;
        };
        Update: Partial<Mutable<TimelineTask>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
