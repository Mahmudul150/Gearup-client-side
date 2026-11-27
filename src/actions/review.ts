"use server";

import { revalidatePath } from "next/cache";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { getAuthCookieHeader } from "@/lib/auth";
import type { CreateReviewInput, Review } from "@/types";

export interface ReviewFormState {
  error?: string;
  success?: boolean;
}

export async function createReview(
  _prev: ReviewFormState | null,
  formData: FormData
): Promise<ReviewFormState> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) {
    return { error: "Please login to leave a review." };
  }

  const gearId = String(formData.get("gearId") ?? "");
  const rating = Number(formData.get("rating") ?? 0);
  const comment = String(formData.get("comment") ?? "").trim();

  if (!gearId || !rating) {
    return { error: "Please select a rating." };
  }

  const payload: CreateReviewInput = { gearId, rating, comment: comment || undefined };

  try {
    await apiFetch<Review>("/api/reviews", {
      method: "POST",
      cookie: cookieHeader,
      body: JSON.stringify(payload),
    });
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    throw err;
  }

  revalidatePath(`/gear/${gearId}`);
  return { success: true };
}
