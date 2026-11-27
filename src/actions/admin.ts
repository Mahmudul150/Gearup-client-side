"use server";

import { revalidatePath } from "next/cache";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { getAuthCookieHeader } from "@/lib/auth";
import type { Category, UserStatus } from "@/types";

export interface AdminFormState {
  error?: string;
  success?: boolean;
}

export async function updateUserStatus(
  userId: string,
  status: UserStatus
): Promise<AdminFormState> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return { error: "Please login first." };

  try {
    await apiFetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      cookie: cookieHeader,
      body: JSON.stringify({ status }),
    });
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    throw err;
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function createCategory(
  _prev: AdminFormState | null,
  formData: FormData
): Promise<AdminFormState> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return { error: "Please login first." };

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) return { error: "Category name is required." };

  try {
    await apiFetch<Category>("/api/category", {
      method: "POST",
      cookie: cookieHeader,
      body: JSON.stringify({ name, description: description || undefined }),
    });
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    throw err;
  }

  revalidatePath("/admin/categories");
  return { success: true };
}
