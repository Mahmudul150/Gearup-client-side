import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { dashboardPath } from "@/lib/constants";

export const metadata: Metadata = { title: "Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const session = await getSession();
  if (session) redirect(dashboardPath(session.role));

  const { from } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Login to rent and manage your gear</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm from={from} />
      </CardContent>
    </Card>
  );
}
