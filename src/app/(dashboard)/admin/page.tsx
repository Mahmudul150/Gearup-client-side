import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Package,
  ScrollText,
  Tags,
  Users,
  UserCheck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiData } from "@/lib/api";
import { getAuthCookieHeader, getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { GearItem, RentalOrder, User } from "@/types";

const quickLinks = [
  { href: "/admin/users", label: "Users", description: "Suspend or activate accounts" },
  { href: "/admin/categories", label: "Categories", description: "Manage gear categories" },
  { href: "/admin/gear", label: "Gear", description: "Review all listings" },
  { href: "/admin/rentals", label: "Rentals", description: "Monitor rental activity" },
];

const quickLinkIcons = {
  "/admin/users": Users,
  "/admin/categories": Tags,
  "/admin/gear": Package,
  "/admin/rentals": CalendarDays,
} as const;

async function getSummary() {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return { users: 0, providers: 0, gear: 0, activeRentals: 0 };

  const [users, gear, rentals] = await Promise.all([
    apiData<User[]>("/api/admin/users", { cookie: cookieHeader }).catch(
      () => [] as User[]
    ),
    apiData<GearItem[]>("/api/admin/gear", { cookie: cookieHeader }).catch(
      () => [] as GearItem[]
    ),
    apiData<RentalOrder[]>("/api/admin/rentals", { cookie: cookieHeader }).catch(
      () => [] as RentalOrder[]
    ),
  ]);

  return {
    users: users.length,
    providers: users.filter((u) => u.role === "PROVIDER").length,
    gear: gear.length,
    activeRentals: rentals.filter(
      (r) => r.status !== "RETURNED" && r.status !== "CANCELLED"
    ).length,
  };
}

function MetricBar({
  label,
  value,
  total,
  emphasis = false,
}: {
  label: string;
  value: number;
  total: number;
  emphasis?: boolean;
}) {
  const percent = total > 0 ? Math.min(Math.round((value / total) * 100), 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {value.toLocaleString()}
          <span className="text-muted-foreground/60"> / {total.toLocaleString()}</span>
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500",
            emphasis ? "bg-foreground" : "bg-muted-foreground/60"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [session, summary] = await Promise.all([getSession(), getSummary()]);

  const providerShare =
    summary.users > 0 ? Math.round((summary.providers / summary.users) * 100) : 0;
  const customerCount = Math.max(summary.users - summary.providers, 0);
  const utilization =
    summary.gear > 0
      ? Math.min(Math.round((summary.activeRentals / summary.gear) * 100), 100)
      : 0;

  const stats = [
    {
      label: "Total users",
      value: summary.users,
      icon: Users,
      caption: "Registered accounts",
    },
    {
      label: "Providers",
      value: summary.providers,
      icon: UserCheck,
      caption: `${providerShare}% of all users`,
    },
    {
      label: "Gear listings",
      value: summary.gear,
      icon: Package,
      caption: "Items available to rent",
    },
    {
      label: "Active rentals",
      value: summary.activeRentals,
      icon: ScrollText,
      caption: `${utilization}% of listings in use`,
    },
  ];

  return (
    <div className="relative isolate space-y-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, color-mix(in oklch, var(--primary) 7%, transparent), transparent 72%)",
        }}
      />

      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase shadow-sm backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
            Admin console
          </span>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Welcome back,{" "}
            <span className="text-muted-foreground">{session?.name ?? "there"}</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Oversee users, listings and rentals across the platform.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-xl border border-border/70 bg-card/70 px-3.5 py-2 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur sm:self-auto">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden />
          Live platform data
        </div>
      </header>

      <section aria-label="Key metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="group relative gap-0 overflow-hidden rounded-2xl border-border/60 bg-card/80 py-5 shadow-[0_1px_2px_oklch(0_0_0/0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lg"
            >
              <div
                aria-hidden
                className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
              />
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                <CardTitle className="text-[13px] font-medium tracking-wide text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <span className="flex size-9 items-center justify-center rounded-xl border border-border/70 bg-muted/60 text-muted-foreground transition-colors duration-200 group-hover:bg-foreground group-hover:text-background">
                  <Icon className="size-4" aria-hidden />
                </span>
              </CardHeader>
              <CardContent className="pb-1">
                <p className="font-heading text-3xl font-semibold tracking-tight tabular-nums sm:text-[2.1rem]">
                  {stat.value.toLocaleString()}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">{stat.caption}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-5" aria-label="Platform insights">
        <Card className="gap-0 rounded-2xl border-border/60 bg-card/80 py-0 shadow-[0_1px_2px_oklch(0_0_0/0.04)] lg:col-span-3">
          <CardHeader className="border-b border-border/60 px-6 py-5">
            <CardTitle className="font-heading text-base font-semibold tracking-tight">
              Platform composition
            </CardTitle>
            <CardDescription className="text-xs">
              Role split and inventory utilisation, derived from live records
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-10">
              <div
                className="relative size-36 shrink-0 rounded-full transition-all duration-500"
                role="img"
                aria-label={`${providerShare}% of users are providers`}
                style={{
                  background: `conic-gradient(var(--foreground) 0% ${providerShare}%, var(--muted) ${providerShare}% 100%)`,
                }}
              >
                <div className="absolute inset-[13px] flex flex-col items-center justify-center rounded-full bg-card shadow-[inset_0_1px_3px_oklch(0_0_0/0.06)]">
                  <span className="font-heading text-2xl font-semibold tracking-tight tabular-nums">
                    {providerShare}%
                  </span>
                  <span className="mt-0.5 text-[11px] text-muted-foreground">Providers</span>
                </div>
              </div>

              <div className="w-full flex-1 space-y-5">
                <MetricBar label="Customers" value={customerCount} total={summary.users} />
                <MetricBar label="Providers" value={summary.providers} total={summary.users} emphasis />
                <MetricBar label="Active rentals" value={summary.activeRentals} total={summary.gear} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-2xl border-border/60 bg-card/80 py-0 shadow-[0_1px_2px_oklch(0_0_0/0.04)] lg:col-span-2">
          <CardHeader className="border-b border-border/60 px-5 py-5">
            <CardTitle className="font-heading text-base font-semibold tracking-tight">
              Management
            </CardTitle>
            <CardDescription className="text-xs">
              Jump straight into an admin area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-3">
            {quickLinks.map((link) => {
              const Icon = quickLinkIcons[link.href as keyof typeof quickLinkIcons];
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "group h-auto w-full justify-start gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition-all hover:border-border/70 hover:bg-muted/60"
                  )}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/60 text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{link.label}</span>
                    <span className="block truncate text-xs font-normal text-muted-foreground">
                      {link.description}
                    </span>
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
