import type { Metadata } from "next";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import type { Role, User } from "@/types";

export const metadata: Metadata = { title: "Profile" };

async function getProfile(): Promise<User | null> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return null;
  try {
    return await apiData<User>("/api/auth/me", { cookie: cookieHeader });
  } catch {
    return null;
  }
}

const roleVariant: Record<Role, string> = {
  ADMIN: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  PROVIDER: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  CUSTOMER: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

export default async function ProfilePage() {
  const [session, profile] = await Promise.all([getSession(), getProfile()]);
  const user = profile ?? (session as User | null);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const info = [
    { icon: Mail, label: "Email", value: user.email },
    { icon: Phone, label: "Phone", value: user.phone },
    { icon: MapPin, label: "Address", value: user.address },
    {
      icon: ShieldCheck,
      label: "Member since",
      value: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Your account information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {user.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profileImage}
                alt={user.name}
                className="size-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                {initials}
              </div>
            )}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <Badge
                  variant="outline"
                  className={cn("border-transparent", roleVariant[user.role])}
                >
                  {user.role}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "border-transparent",
                    user.status === "ACTIVE"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-500/15 text-red-600 dark:text-red-400"
                  )}
                >
                  {user.status}
                </Badge>
              </div>
              <CardDescription>
                Read-only profile — contact support to update your details.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            {info.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <Icon
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd className="font-medium">
                      {item.value || "Not provided"}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
