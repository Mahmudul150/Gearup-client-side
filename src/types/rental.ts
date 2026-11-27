import type { GearItem } from "./gear";
import type { Payment } from "./payment";
import type { User } from "./user";

export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED";

export interface RentalOrder {
  id: string;
  customerId: string;
  customer?: User;
  gearId: string;
  gear?: GearItem;
  startDate: string;
  endDate: string;
  returnedAt?: string | null;
  quantity: number;
  totalPrice: number;
  status: RentalStatus;
  payment?: Payment | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRentalInput {
  gearId: string;
  startDate: string;
  endDate: string;
  quantity?: number;
}
