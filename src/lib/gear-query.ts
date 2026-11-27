export interface GearSearchParams {
  q: string;
  category: string;
  brand: string;
  available: "" | "true" | "false";
  sort: string;
  page: number;
}

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A–Z" },
] as const;

const SORT_MAP: Record<string, { sortBy: string; sortOrder: "asc" | "desc" }> = {
  newest: { sortBy: "createdAt", sortOrder: "desc" },
  "price-asc": { sortBy: "pricePerDay", sortOrder: "asc" },
  "price-desc": { sortBy: "pricePerDay", sortOrder: "desc" },
  name: { sortBy: "name", sortOrder: "asc" },
};

export const PAGE_SIZE = 12;

export function parseGearSearchParams(raw: RawSearchParams): GearSearchParams {
  const available = first(raw.available);
  const page = Number(first(raw.page));

  return {
    q: first(raw.q).trim(),
    category: first(raw.category),
    brand: first(raw.brand).trim(),
    available: available === "true" || available === "false" ? available : "",
    sort: first(raw.sort) || "newest",
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
  };
}

/** Query string for the backend `GET /api/gear`. */
export function toApiQuery(params: GearSearchParams): string {
  const query = new URLSearchParams();
  if (params.q) query.set("searchTerm", params.q);
  if (params.category) query.set("categoryId", params.category);
  if (params.brand) query.set("brand", params.brand);
  if (params.available) query.set("isAvailable", params.available);

  const sort = SORT_MAP[params.sort] ?? SORT_MAP.newest;
  query.set("sortBy", sort.sortBy);
  query.set("sortOrder", sort.sortOrder);
  query.set("page", String(params.page));
  query.set("limit", String(PAGE_SIZE));

  return query.toString();
}

/** Builds a `/gear` href from current params with the given overrides (null deletes a key). */
export function gearHref(
  params: GearSearchParams,
  overrides: Partial<Record<keyof GearSearchParams, string | number | null>> = {}
): string {
  const merged: Record<string, string> = {
    q: params.q,
    category: params.category,
    brand: params.brand,
    available: params.available,
    sort: params.sort === "newest" ? "" : params.sort,
    page: params.page > 1 ? String(params.page) : "",
    ...Object.fromEntries(
      Object.entries(overrides).map(([key, value]) => [
        key,
        value === null || value === undefined ? "" : String(value),
      ])
    ),
  };

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value) query.set(key, value);
  }

  const qs = query.toString();
  return qs ? `/gear?${qs}` : "/gear";
}
