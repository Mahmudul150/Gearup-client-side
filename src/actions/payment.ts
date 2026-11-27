"use server";

import { redirect } from "next/navigation";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { getAuthCookieHeader } from "@/lib/auth";
import type { Payment } from "@/types";

export interface PaymentFormState {
  error?: string;
}

export async function initiatePayment(
  _prev: PaymentFormState | null,
  formData: FormData
): Promise<PaymentFormState> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) {
    return { error: "Please login to continue." };
  }

  const rentalId = String(formData.get("rentalId") ?? "");
  if (!rentalId) {
    return { error: "Missing rental order." };
  }

  let paymentUrl: string;
  try {
    const res = await apiFetch<{ paymentUrl: string }>("/api/payments/create", {
      method: "POST",
      cookie: cookieHeader,
      body: JSON.stringify({ rentalId }),
    });
    paymentUrl = res.data.paymentUrl;
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    throw err;
  }

  if (!paymentUrl) {
    return { error: "Could not create payment session." };
  }

  redirect(paymentUrl);
}

/** Asks the backend to verify the Stripe session before trusting the redirect. */
export async function verifyPaymentSession(
  sessionId: string
): Promise<{ payment: Payment | null; error: string | null }> {
  const cookieHeader = await getAuthCookieHeader();
  if (!cookieHeader) {
    return { payment: null, error: "Please login to continue." };
  }

  try {
    const res = await apiFetch<{ verified: boolean; payment?: Payment }>(
      "/api/payments/verify",
      {
        method: "POST",
        cookie: cookieHeader,
        body: JSON.stringify({ sessionId }),
      }
    );

    return { payment: res.data.payment ?? null, error: null };
  } catch (err) {
    if (err instanceof ApiRequestError) {
      return { payment: null, error: err.message };
    }
    return { payment: null, error: "Unable to verify payment status." };
  }
}
