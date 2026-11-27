import type { Metadata } from "next";
import { Users } from "lucide-react";
import { UserStatusToggle } from "@/components/admin/user-status-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiData } from "@/lib/api";
import { getAuthCookieHeader, getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { Role, User } from "@/types";

export const metadata: Metadata = { title: "Users" };

async function getUsers(): Promise<User[]> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return [];
  try {
    return await apiData<User[]>("/api/admin/users", { cookie: cookieHeader });
  } catch {
    return [];
  }
}

const roleVariant: Record<Role, string> = {
  ADMIN: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  PROVIDER: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  CUSTOMER: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

export default async function AdminUsersPage() {
  const [users, session] = await Promise.all([getUsers(), getSession()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          {users.length} account{users.length === 1 ? "" : "s"}
        </p>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <Users className="size-10 text-muted-foreground" aria-hidden />
            <p className="font-medium">No users found</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("border-transparent", roleVariant[user.role])}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.id === session?.id ? (
                          <span className="text-xs text-muted-foreground">You</span>
                        ) : (
                          <UserStatusToggle userId={user.id} current={user.status} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
