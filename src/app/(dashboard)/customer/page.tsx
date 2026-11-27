import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

const quickLinks = [
  { href: "/customer/rentals", label: "My rentals", description: "Track current and past orders" },
  { href: "/customer/payments", label: "Payments", description: "View your payment history" },
  { href: "/gear", label: "Browse gear", description: "Find your next rental" },
  { href: "/profile", label: "Profile", description: "Manage your account" },
];

export default async function CustomerDashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {session?.name ?? "there"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your rentals and payments from here.
        </p>
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
