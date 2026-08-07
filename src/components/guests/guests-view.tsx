"use client";

import * as React from "react";
import {
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Plus,
  Search,
  UserPlus,
  Users,
  Utensils,
} from "lucide-react";

import { GuestDialog } from "@/components/guests/guest-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { QueryState } from "@/components/shared/query-state";
import { RowMenu } from "@/components/shared/row-menu";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GUEST_SIDES, RSVP_STATUSES } from "@/lib/constants";
import {
  summariseGuests,
  useDeleteGuest,
  useGuests,
  useUpdateGuest,
} from "@/lib/hooks/use-guests";
import type { Guest, RsvpStatus } from "@/lib/types";

const rsvpConfig = (status: RsvpStatus) =>
  RSVP_STATUSES.find((item) => item.value === status) ?? RSVP_STATUSES[0]!;

const sideLabel = (side: Guest["side"]) =>
  GUEST_SIDES.find((item) => item.value === side)?.label ?? "Both";

export function GuestsView() {
  const { data, isPending, isError, error, refetch } = useGuests();
  const updateGuest = useUpdateGuest();
  const deleteGuest = useDeleteGuest();

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<RsvpStatus | "all">(
    "all",
  );
  const [dialogGuest, setDialogGuest] = React.useState<Guest | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<Guest | null>(null);

  const guests = React.useMemo(() => data ?? [], [data]);
  const stats = React.useMemo(() => summariseGuests(guests), [guests]);

  const visible = React.useMemo(() => {
    const term = search.trim().toLowerCase();

    return guests.filter((guest) => {
      const matchesStatus =
        statusFilter === "all" || guest.rsvp_status === statusFilter;
      if (!matchesStatus) return false;
      if (!term) return true;

      return [
        guest.first_name,
        guest.last_name,
        guest.email ?? "",
        guest.role ?? "",
        guest.table_number ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [guests, search, statusFilter]);

  function openAdd() {
    setDialogGuest(null);
    setDialogOpen(true);
  }

  function openEdit(guest: Guest) {
    setDialogGuest(guest);
    setDialogOpen(true);
  }

  function changeRsvp(guest: Guest, rsvp_status: RsvpStatus) {
    updateGuest.mutate({ id: guest.id, rsvp_status });
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Guests"
        description="Track invitations, RSVPs, seating and dietary needs."
        action={
          <Button onClick={openAdd}>
            <Plus />
            Add guest
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Invited"
          value={String(stats.invited)}
          hint={`${stats.households} ${stats.households === 1 ? "invitation" : "invitations"}`}
          icon={Users}
        />
        <StatCard
          label="Attending"
          value={String(stats.attending)}
          hint={`${stats.maybe} still deciding`}
          icon={CheckCircle2}
          accentClassName="bg-sage-100 text-sage-600"
        />
        <StatCard
          label="Awaiting reply"
          value={String(stats.pending)}
          hint={`${stats.declined} declined`}
          icon={Clock}
          accentClassName="bg-champagne-100 text-champagne-600"
        />
        <StatCard
          label="Seated"
          value={`${stats.seated}/${stats.households}`}
          hint="Invitations with a table assigned"
          icon={Utensils}
          accentClassName="bg-blush-100 text-blush-600"
        />
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, role or table"
                className="pl-9"
                aria-label="Search guests"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as RsvpStatus | "all")
              }
            >
              <SelectTrigger className="sm:w-52" aria-label="Filter by RSVP">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All RSVPs</SelectItem>
                {RSVP_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
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
          >
            {guests.length === 0 ? (
              <EmptyState
                icon={UserPlus}
                title="No guests yet"
                description="Add the people you know are coming, then work outwards. Party size covers plus-ones."
                action={
                  <Button onClick={openAdd}>
                    <Plus />
                    Add your first guest
                  </Button>
                }
              />
            ) : visible.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No matches"
                description="Nobody on the list matches that search or filter."
              />
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead>RSVP</TableHead>
                        <TableHead>Party</TableHead>
                        <TableHead>Side</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Table</TableHead>
                        <TableHead className="w-12" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visible.map((guest) => (
                        <TableRow key={guest.id}>
                          <TableCell>
                            <div className="font-medium">
                              {guest.first_name} {guest.last_name}
                            </div>
                            {guest.email ? (
                              <div className="text-xs text-muted-foreground">
                                {guest.email}
                              </div>
                            ) : null}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={guest.rsvp_status}
                              onValueChange={(value) =>
                                changeRsvp(guest, value as RsvpStatus)
                              }
                            >
                              <SelectTrigger
                                className="h-8 w-[9.5rem] text-xs"
                                aria-label={`RSVP for ${guest.first_name}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {RSVP_STATUSES.map((status) => (
                                  <SelectItem
                                    key={status.value}
                                    value={status.value}
                                  >
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{guest.party_size}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {sideLabel(guest.side)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {guest.role ?? "Guest"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {guest.table_number ?? "—"}
                          </TableCell>
                          <TableCell>
                            <RowMenu
                              onEdit={() => openEdit(guest)}
                              onDelete={() => setPendingDelete(guest)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile */}
                <ul className="space-y-3 md:hidden">
                  {visible.map((guest) => {
                    const config = rsvpConfig(guest.rsvp_status);
                    return (
                      <li
                        key={guest.id}
                        className="rounded-lg border border-border p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {guest.first_name} {guest.last_name}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Party of {guest.party_size} ·{" "}
                              {sideLabel(guest.side)} · {guest.role ?? "Guest"}
                            </p>
                          </div>
                          <RowMenu
                            onEdit={() => openEdit(guest)}
                            onDelete={() => setPendingDelete(guest)}
                          />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <StatusBadge
                            label={config.label}
                            className={config.className}
                          />
                          {guest.table_number ? (
                            <StatusBadge
                              label={`Table ${guest.table_number}`}
                              className="bg-muted text-muted-foreground"
                            />
                          ) : null}
                        </div>

                        {guest.email || guest.phone ? (
                          <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                            {guest.email ? (
                              <p className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                {guest.email}
                              </p>
                            ) : null}
                            {guest.phone ? (
                              <p className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5" />
                                {guest.phone}
                              </p>
                            ) : null}
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </QueryState>
        </CardContent>
      </Card>

      <GuestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        guest={dialogGuest}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Remove this guest?"
        description={
          pendingDelete
            ? `${pendingDelete.first_name} ${pendingDelete.last_name} will be deleted from your guest list. This cannot be undone.`
            : ""
        }
        confirmLabel="Remove guest"
        isPending={deleteGuest.isPending}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteGuest.mutate(pendingDelete.id, {
            onSuccess: () => setPendingDelete(null),
          });
        }}
      />
    </div>
  );
}
