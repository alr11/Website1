import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/components/providers";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The middleware normally handles this; this is the belt-and-braces check.
  if (!user) {
    redirect("/login");
  }

  return (
    <Providers user={{ id: user.id, email: user.email ?? "" }}>
      <AppShell>{children}</AppShell>
    </Providers>
  );
}
