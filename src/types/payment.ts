import type { RentalOrder } from "./rental";

export type PaymentMethod = "STRIPE" | "SSLCOMMERZ";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Payment {
  id: string;
  transactionId: string;
  rentalOrderId: string;
  rentalOrder?: RentalOrder;
  amount: number;
  provider: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentInput {
  rentalOrderId: string;
}
