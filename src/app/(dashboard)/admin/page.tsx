import Link from "next/link";
import { ArrowRight, Package, ScrollText, Users, UserCheck } from "lucide-react";
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

export default async function AdminDashboardPage() {
  const [session, summary] = await Promise.all([getSession(), getSummary()]);

  const stats = [
    { label: "Total users", value: summary.users, icon: Users },
    { label: "Providers", value: summary.providers, icon: UserCheck },
    { label: "Gear listings", value: summary.gear, icon: Package },
    { label: "Active rentals", value: summary.activeRentals, icon: ScrollText },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {session?.name ?? "there"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Oversee users, listings and rentals across the platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((link) => (
          <Card key={link.href}>
            <CardHeader>
              <CardTitle className="text-base">{link.label}</CardTitle>
              <CardDescription>{link.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={link.href}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "gap-1.5"
                )}
              >
                Open
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
