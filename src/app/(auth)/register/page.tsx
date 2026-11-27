import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { dashboardPath } from "@/lib/constants";

export const metadata: Metadata = { title: "Register" };

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect(dashboardPath(session.role));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription>
          Join GearUp as a customer to rent gear, or as a provider to list it for others to rent.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
