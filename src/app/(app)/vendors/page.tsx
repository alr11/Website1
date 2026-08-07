import type { Metadata } from "next";

import { VendorsView } from "@/components/vendors/vendors-view";

export const metadata: Metadata = {
  title: "Vendors — Everly",
};

export default function VendorsPage() {
  return <VendorsView />;
}
