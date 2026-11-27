import type { Category } from "./category";
import type { Review } from "./review";
import type { User } from "./user";

export interface GearItem {
  id: string;
  name: string;
  description: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  condition: string;
  image?: string | null;
  isAvailable: boolean;
  specifications?: string | null;
  providerId: string;
  categoryId: string;
  provider?: User;
  category?: Category;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface GearListMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface GearListResponse {
  data: GearItem[];
  meta: GearListMeta;
}

export interface GearFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  isAvailable?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
