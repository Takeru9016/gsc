import {
  Calendar,
  CheckCircle2,
  Contact,
  IdCard,
  Images,
  ListChecks,
  Plus,
  ToggleLeft,
  Trophy,
  UsersRound,
} from "lucide-react";
import { RecentActivity } from "@/components/sections/admin/RecentActivity.tsx";
import { AdminStatCard } from "@/components/shared/AdminStatCard.tsx";
import { Button } from "@/components/shared/Button.tsx";
import {
  getLatestBookings,
  getLatestContacts,
  getSubmissionPendingCounts,
} from "@/lib/db/adminQueries.ts";
import {
  getDashboardContentCounts,
  getLatestEvents,
} from "@/lib/sanity/queries.ts";

interface AdminDashboardPageProps {
  searchParams: Promise<{ notice?: string }>;
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const [
    pendingCounts,
    contentCounts,
    latestBookings,
    latestContacts,
    latestEvents,
    { notice },
  ] = await Promise.all([
    getSubmissionPendingCounts(),
    getDashboardContentCounts(),
    getLatestBookings(5),
    getLatestContacts(5),
    getLatestEvents(),
    searchParams,
  ]);

  const submissionCards = [
    {
      href: "/admin/submissions/bookings",
      icon: <Calendar className="size-6" />,
      label: "Pending Bookings",
      value: pendingCounts.bookings,
    },
    {
      href: "/admin/submissions/memberships",
      icon: <IdCard className="size-6" />,
      label: "Pending Memberships",
      value: pendingCounts.memberships,
    },
    {
      href: "/admin/submissions/contacts",
      icon: <Contact className="size-6" />,
      label: "Pending Contacts",
      value: pendingCounts.contacts,
    },
    {
      href: "/admin/submissions/partners",
      icon: <UsersRound className="size-6" />,
      label: "Pending Partners",
      value: pendingCounts.partners,
    },
  ];

  const contentCards = [
    {
      href: "/admin/content/sports",
      icon: <Trophy className="size-6" />,
      isPending: false,
      label: "Total Sports",
      value: contentCounts.totalSports,
    },
    {
      href: "/admin/content/events",
      icon: <Calendar className="size-6" />,
      isPending: false,
      label: "Active Events",
      value: contentCounts.activeEvents,
    },
    {
      href: "/admin/content/achievements",
      icon: <Images className="size-6" />,
      isPending: false,
      label: "Achievements (Approved)",
      value: contentCounts.approvedAchievements,
    },
    {
      href: "/admin/submissions/achievements",
      icon: <Trophy className="size-6" />,
      isPending: true,
      label: "Pending Achievements",
      value: pendingCounts.achievements,
    },
  ];

  return (
    <div className="space-y-10">
      {notice === "unauthorized" ? (
        <div className="rounded-xl border border-accent-red/20 bg-accent-red/10 px-4 py-3 text-accent-red text-sm">
          You don't have permission to view that page. Only admins can manage
          users.
        </div>
      ) : null}

      <div>
        <h1 className="font-display font-semibold text-3xl">Dashboard</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Overview of submissions and content across GSC.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-(--color-text-secondary) text-xs uppercase tracking-widest">
          Submissions Inbox
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {submissionCards.map((card) => (
            <AdminStatCard
              href={card.href}
              icon={card.icon}
              isPending
              key={card.label}
              label={card.label}
              value={card.value}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-(--color-text-secondary) text-xs uppercase tracking-widest">
          Content Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contentCards.map((card) => (
            <AdminStatCard
              href={card.href}
              icon={card.icon}
              isPending={card.isPending}
              key={card.label}
              label={card.label}
              value={card.value}
            />
          ))}
        </div>
      </section>

      <RecentActivity
        bookings={latestBookings}
        contacts={latestContacts}
        events={latestEvents}
      />

      <section className="space-y-4">
        <h2 className="text-(--color-text-secondary) text-xs uppercase tracking-widest">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button href="/admin/content/events/new" size="sm" variant="primary">
            <Plus className="size-4" />
            Add New Event
          </Button>
          <Button
            href="/admin/content/membership"
            size="sm"
            variant="secondary"
          >
            <ToggleLeft className="size-4" />
            Toggle Membership Enrollment
          </Button>
          <Button
            href="/admin/submissions/achievements"
            size="sm"
            variant="secondary"
          >
            <CheckCircle2 className="size-4" />
            Approve Achievements
          </Button>
          <Button
            href="/admin/submissions/bookings"
            size="sm"
            variant="secondary"
          >
            <ListChecks className="size-4" />
            View All Submissions
          </Button>
        </div>
      </section>
    </div>
  );
}
