import type { Metadata } from "next";

import { GuestsView } from "@/components/guests/guests-view";

export const metadata: Metadata = {
  title: "Guests — Everly",
};

export default function GuestsPage() {
  return <GuestsView />;
}
