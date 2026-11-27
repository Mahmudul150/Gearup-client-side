import type { Metadata } from "next";
import { Tags } from "lucide-react";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
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
import type { Category } from "@/types";

export const metadata: Metadata = { title: "Categories" };

async function getCategories(): Promise<Category[]> {
  try {
    return await apiData<Category[]>("/api/category");
  } catch {
    return [];
  }
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"}
          </p>
        </div>
        <CategoryFormDialog />
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <Tags className="size-10 text-muted-foreground" aria-hidden />
            <div>
              <p className="font-medium">No categories yet</p>
              <p className="text-sm text-muted-foreground">
                Create one to start organizing gear.
              </p>
            </div>
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
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <Badge variant="secondary">{category.name}</Badge>
                      </TableCell>
                      <TableCell className="max-w-md text-muted-foreground">
                        {category.description || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(category.createdAt).toLocaleDateString()}
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
