import type { GearItem } from "./gear";
import type { User } from "./user";

export interface Review {
  id: string;
  customerId: string;
  customer?: User;
  gearId: string;
  gear?: GearItem;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewInput {
  gearId: string;
  rating: number;
  comment?: string;
}
