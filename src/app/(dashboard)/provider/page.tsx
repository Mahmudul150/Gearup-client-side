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
  { href: "/provider/gear", label: "My gear", description: "Add, edit and manage inventory" },
  { href: "/provider/orders", label: "Orders", description: "Process incoming rental orders" },
  { href: "/profile", label: "Profile", description: "Manage your account" },
];

export default async function ProviderDashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {session?.name ?? "there"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your inventory and rental orders.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
