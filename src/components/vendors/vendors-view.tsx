"use client";

import * as React from "react";
import {
  BadgeCheck,
  Banknote,
  ExternalLink,
  Mail,
  Phone,
  Plus,
  Search,
  Store,
  User,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { QueryState } from "@/components/shared/query-state";
import { RowMenu } from "@/components/shared/row-menu";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { VendorDialog } from "@/components/vendors/vendor-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VENDOR_STATUSES, VENDOR_TYPES } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import {
  summariseVendors,
  useDeleteVendor,
  useVendors,
} from "@/lib/hooks/use-vendors";
import type { Vendor, VendorStatus } from "@/lib/types";

const statusConfig = (status: VendorStatus) =>
  VENDOR_STATUSES.find((item) => item.value === status) ?? VENDOR_STATUSES[0]!;

/** Adds a scheme so a pasted "ivyhouse.com" still opens correctly. */
function toHref(website: string) {
  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

export function VendorsView() {
  const { data, isPending, isError, error, refetch } = useVendors();
  const deleteVendor = useDeleteVendor();

  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [activeVendor, setActiveVendor] = React.useState<Vendor | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<Vendor | null>(null);

  const vendors = React.useMemo(() => data ?? [], [data]);
  const stats = React.useMemo(() => summariseVendors(vendors), [vendors]);

  const visible = React.useMemo(() => {
    const term = search.trim().toLowerCase();

    return vendors.filter((vendor) => {
      if (typeFilter !== "all" && vendor.vendor_type !== typeFilter) {
        return false;
      }
      if (!term) return true;

      return [vendor.name, vendor.contact_name ?? "", vendor.email ?? "", vendor.notes ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [vendors, search, typeFilter]);

  const usedTypes = React.useMemo(
    () =>
      VENDOR_TYPES.filter((type) =>
        vendors.some((vendor) => vendor.vendor_type === type),
      ),
    [vendors],
  );

  function openAdd() {
    setActiveVendor(null);
    setDialogOpen(true);
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Vendors"
        description="Every quote, contact and deposit in one directory."
        action={
          <Button onClick={openAdd}>
            <Plus />
            Add vendor
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Vendors"
          value={String(stats.total)}
          hint={`${usedTypes.length} categories covered`}
          icon={Store}
        />
        <StatCard
          label="Booked"
          value={String(stats.booked)}
          hint={`${stats.outstandingLeads} still being chased`}
          icon={BadgeCheck}
          accentClassName="bg-sage-100 text-sage-600"
        />
        <StatCard
          label="Contracted"
          value={formatCurrency(stats.contractedCost)}
          hint="Quoted cost of booked vendors"
          icon={Banknote}
          accentClassName="bg-champagne-100 text-champagne-600"
        />
        <StatCard
          label="Deposits paid"
          value={formatCurrency(stats.depositsPaid)}
          hint="Across all vendors"
          icon={Banknote}
          accentClassName="bg-blush-100 text-blush-600"
        />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search vendors, contacts or notes"
            className="pl-9"
            aria-label="Search vendors"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="sm:w-56" aria-label="Filter by vendor type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {usedTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <QueryState
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        skeletonRows={4}
      >
        {vendors.length === 0 ? (
          <EmptyState
            icon={Store}
            title="No vendors yet"
            description="Add the venues, caterers and photographers you're considering — even the ones you haven't contacted."
            action={
              <Button onClick={openAdd}>
                <Plus />
                Add your first vendor
              </Button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No matches"
            description="No vendor matches that search or filter."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {visible.map((vendor) => {
              const config = statusConfig(vendor.status);
              const balance = vendor.estimated_cost - vendor.deposit_paid;

              return (
                <Card key={vendor.id} className="hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {vendor.vendor_type}
                        </p>
                        <h3 className="mt-1 truncate font-serif text-lg font-semibold">
                          {vendor.name}
                        </h3>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <StatusBadge
                          label={config.label}
                          className={config.className}
                        />
                        <RowMenu
                          label={`Actions for ${vendor.name}`}
                          onEdit={() => {
                            setActiveVendor(vendor);
                            setDialogOpen(true);
                          }}
                          onDelete={() => setPendingDelete(vendor)}
                        />
                      </div>
                    </div>

                    <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                      {vendor.contact_name ? (
                        <p className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{vendor.contact_name}</span>
                        </p>
                      ) : null}
                      {vendor.email ? (
                        <p className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <a
                            href={`mailto:${vendor.email}`}
                            className="truncate transition-colors hover:text-foreground"
                          >
                            {vendor.email}
                          </a>
                        </p>
                      ) : null}
                      {vendor.phone ? (
                        <p className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <a
                            href={`tel:${vendor.phone}`}
                            className="truncate transition-colors hover:text-foreground"
                          >
                            {vendor.phone}
                          </a>
                        </p>
                      ) : null}
                      {vendor.website ? (
                        <p className="flex items-center gap-2">
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                          <a
                            href={toHref(vendor.website)}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="truncate transition-colors hover:text-foreground"
                          >
                            {vendor.website}
                          </a>
                        </p>
                      ) : null}
                    </div>

                    {vendor.notes ? (
                      <p className="mt-4 line-clamp-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                        {vendor.notes}
                      </p>
                    ) : null}

                    <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Quoted</p>
                        <p className="font-serif text-xl font-semibold">
                          {formatCurrency(vendor.estimated_cost)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {vendor.deposit_paid > 0
                            ? `${formatCurrency(vendor.deposit_paid)} deposit paid`
                            : "No deposit yet"}
                        </p>
                        <p className="text-sm font-medium">
                          {formatCurrency(Math.max(0, balance))} outstanding
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </QueryState>

      <VendorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vendor={activeVendor}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Remove this vendor?"
        description={
          pendingDelete
            ? `${pendingDelete.name} will be deleted. Expenses linked to them stay in your budget.`
            : ""
        }
        confirmLabel="Remove vendor"
        isPending={deleteVendor.isPending}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteVendor.mutate(pendingDelete.id, {
            onSuccess: () => setPendingDelete(null),
          });
        }}
      />
    </div>
  );
}
