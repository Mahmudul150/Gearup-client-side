import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Tags } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiData } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export const metadata: Metadata = { title: "Categories" };

async function getCategories(): Promise<Category[]> {
  try {
    return await apiData<Category[]>("/api/category");
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Browse gear by category — {categories.length} available
        </p>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <Tags className="size-10 text-muted-foreground" aria-hidden />
            <div>
              <p className="font-medium">No categories found</p>
              <p className="text-sm text-muted-foreground">
                Check back later or browse all gear instead.
              </p>
            </div>
            <Link href="/gear" className={cn(buttonVariants())}>
              Browse all gear
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="transition-all hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle className="text-base">{category.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {category.description || "No description available."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/gear?category=${category.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "gap-1.5"
                  )}
                >
                  Browse gear
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
