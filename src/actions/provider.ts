"use server";

import { revalidatePath } from "next/cache";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { getAuthCookieHeader } from "@/lib/auth";
import type { RentalStatus } from "@/types";

export interface ProviderFormState {
  error?: string;
  success?: boolean;
}

function buildGearPayload(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    brand: String(formData.get("brand") ?? "").trim(),
    pricePerDay: Number(formData.get("pricePerDay") ?? 0),
    stock: Number(formData.get("stock") ?? 0),
    condition: String(formData.get("condition") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim() || undefined,
    specifications: String(formData.get("specifications") ?? "").trim() || undefined,
    categoryId: String(formData.get("categoryId") ?? ""),
  };
}

export async function saveGear(
  _prev: ProviderFormState | null,
  formData: FormData
): Promise<ProviderFormState> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return { error: "Please login first." };

  const id = String(formData.get("id") ?? "");
  const payload = buildGearPayload(formData);

  if (!payload.name || !payload.description || !payload.brand || !payload.categoryId) {
    return { error: "Name, description, brand and category are required." };
  }
  if (!(payload.pricePerDay > 0)) return { error: "Price per day must be greater than 0." };
  if (!(payload.stock >= 0)) return { error: "Stock cannot be negative." };
  if (!payload.condition) return { error: "Condition is required." };

  try {
    if (id) {
      await apiFetch(`/api/provider/gear/${id}`, {
        method: "PUT",
        cookie: cookieHeader,
        body: JSON.stringify(payload),
      });
    } else {
      await apiFetch("/api/provider/gear", {
        method: "POST",
        cookie: cookieHeader,
        body: JSON.stringify(payload),
      });
    }
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    throw err;
  }

  revalidatePath("/provider/gear");
  return { success: true };
}

export async function deleteGear(
  _prev: ProviderFormState | null,
  formData: FormData
): Promise<ProviderFormState> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return { error: "Please login first." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing gear id." };

  try {
    await apiFetch(`/api/provider/gear/${id}`, {
      method: "DELETE",
      cookie: cookieHeader,
    });
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    throw err;
  }

  revalidatePath("/provider/gear");
  return { success: true };
}

export async function updateOrderStatus(
  orderId: string,
  status: RentalStatus
): Promise<ProviderFormState> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) return { error: "Please login first." };

  try {
    await apiFetch(`/api/provider/orders/${orderId}`, {
      method: "PATCH",
      cookie: cookieHeader,
      body: JSON.stringify({ status }),
    });
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    throw err;
  }

  revalidatePath("/provider/orders");
  return { success: true };
}
