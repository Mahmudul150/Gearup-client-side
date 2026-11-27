"use server";

import { redirect } from "next/navigation";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { getAuthCookieHeader } from "@/lib/auth";
import type { CreateRentalInput, RentalOrder } from "@/types";

export interface RentalFormState {
  error?: string;
}

export async function createRental(
  _prev: RentalFormState | null,
  formData: FormData
): Promise<RentalFormState> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) {
    return { error: "Please login to rent this gear." };
  }

  const gearId = String(formData.get("gearId") ?? "");
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));

  if (!gearId || !startDate || !endDate) {
    return { error: "Pick start and end dates." };
  }

  const payload: CreateRentalInput = { gearId, startDate, endDate, quantity };

  let rental: RentalOrder;
  try {
    rental = await apiFetch<RentalOrder>("/api/rentals", {
      method: "POST",
      cookie: cookieHeader,
      body: JSON.stringify(payload),
    }).then((res) => res.data);
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    throw err;
  }

  redirect(`/checkout?rentalId=${rental.id}`);
}
