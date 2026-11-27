# GearUp Design System

A reusable visual language extracted from the approved **Admin dashboard overview** (`src/app/(dashboard)/admin/page.tsx`). The approved page is the reference implementation; its appearance must not change. Apply these tokens progressively to other pages only when explicitly requested.

**Foundation:** Tailwind CSS v4 + shadcn/base-nova primitives, neutral `oklch` theme, lucide-react icons, Geist fonts. All colors are CSS variables so light and dark themes work automatically.

---

## 1. Colors

### Primary / secondary
| Token | Light | Dark | Usage |
|---|---|---|---|
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` | Main action, active indicator dot, hover inversion |
| `--primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` | Text on primary |
| `--secondary` / `--accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Hover surfaces, secondary chips |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | Errors, failed states |
| `--chart-1 … --chart-5` | `0.87 → 0.269` (neutral greys) | same | Data visualization scale |

### Background / surface
| Token | Light | Dark | Usage |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Page background |
| `--card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | Panel base |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Tracks, icon tiles, hover fills |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | Secondary text |
| `--ds-surface-glass` | `color-mix(card 80%, transparent)` | same | Panel / glass surface → `bg-surface-glass` |
| `--ds-border-subtle` | `color-mix(border 60%, transparent)` | same | Panel borders / dividers → `border-border-subtle` |
| `--ds-border-soft` | `color-mix(border 70%, transparent)` | same | Icon tiles, pills → `border-border-soft` |

Ambient page glow (approved admin): radial gradient using `color-mix(in oklch, var(--primary) 7%, transparent)` fading to transparent at 72%, height `16rem`, top-anchored, `pointer-events-none -z-10`.

---

## 2. Typography

Families: `--font-sans` (Geist) for body, `--font-heading` (Geist) for headings, `--font-mono` (Geist Mono) for code. Root is `font-sans antialiased`.

| Role | Classes / tokens |
|---|---|
| Page title (H1) | `font-heading text-3xl font-semibold tracking-tight sm:text-4xl` |
| Muted name in title | `text-muted-foreground` |
| Section / card title | `font-heading text-base font-semibold tracking-tight` |
| Stat value | `font-heading text-3xl font-semibold tracking-tight tabular-nums sm:text-[2.1rem]` (`.ds-stat-value`) |
| Stat label | `text-[13px] font-medium tracking-wide text-muted-foreground` |
| Body copy | `text-sm leading-relaxed text-muted-foreground` |
| Caption / meta | `text-xs text-muted-foreground` |
| Eyebrow label | `text-[11px] font-medium uppercase tracking-[0.14em]` (`.ds-eyebrow`, `--tracking-eyebrow`) |
| Numeric data | `tabular-nums` always |

---

## 3. Spacing

Tailwind 4 spacing scale (`--spacing` based). Established rhythm:

- Page sections: `space-y-8` (2rem)
- Header internals: `space-y-2` (0.5rem), `gap-5` (1.25rem)
- Stat grid: `gap-3` (0.75rem) → `sm:grid-cols-2` → `xl:grid-cols-4`
- Insights grid: `gap-4` (1rem), `lg:grid-cols-5` with `3/2` split
- Panel padding: headers `px-6 py-5` / `px-5 py-5`, content `px-6 py-6`, compact `p-3`
- Stat card: `py-5`, header `pb-4`, value `pb-1`, caption `mt-1.5`
- List rows: `gap-3`, `px-3 py-3`, `space-y-2`
- Dashboard content frame: `p-4 sm:p-6`

---

## 4. Border radius

Project tokens (base `--radius: 0.625rem`):

| Token | Value | Typical use |
|---|---|---|
| `--radius-sm` / `rounded-sm` | 0.375rem | Tiny elements |
| `--radius-md` / `rounded-md` | 0.5rem | Nav links |
| `--radius-lg` / `rounded-lg` | 0.625rem | Default buttons, inputs |
| `--radius-xl` / `rounded-xl` | 0.875rem | Icon tiles, pills, list rows (`--radius-tile`) |
| `--radius-2xl` / `rounded-2xl` | 1.125rem | Dashboard panels (`--radius-panel`) |
| `--radius-3xl`, `--radius-4xl` | 1.375rem, 1.625rem | Large surfaces |
| Full pill | `rounded-full` | Eyebrows, donut, status dots |

Use `.ds-panel` (2xl) and `.ds-icon-tile` (xl) instead of repeating values.

---

## 5. Shadows & borders

- Global reset: `* { @apply border-border outline-ring/50 }`
- Panel border: `border-border/60` (`--ds-border-subtle`)
- Tile / pill border: `border-border/70` (`--ds-border-soft`)
- Panel shadow: `0 1px 2px oklch(0 0 0 / 0.04)` (`--ds-shadow-panel`, utility `shadow-panel`)
- Hover shadow: `hover:shadow-lg`
- Focus ring: `focus-visible:ring-3 focus-visible:ring-ring/50`
- Donut inset: `inset 0 1px 3px oklch(0 0 0 / 0.06)`
- Hairline highlight: top 1px gradient `transparent → foreground/15 → transparent`
- Dividers: `border-b border-border/60`

---

## 6. Buttons

Base from `buttonVariants` (`src/components/ui/button.tsx`): `inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50`.

Variants: `default` (primary), `outline`, `secondary`, `ghost`, `destructive`, `link`.
Sizes: `xs` (h-6), `sm` (h-7), `default` (h-8), `lg` (h-9), `icon` (size-8), `icon-xs/sm/lg`.

Admin pattern (management rows): `buttonVariants({ variant: "ghost" })` extended with `group h-auto w-full justify-start gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition-all hover:border-border/70 hover:bg-muted/60`.

---

## 7. Cards

Base `Card` (`src/components/ui/card.tsx`): `flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10`, `--card-spacing: --spacing(4)`. Slots: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction`.

Approved admin panel styling (use `.ds-panel`):
- `gap-0 rounded-2xl border-border/60 bg-card/80 py-0 shadow-panel`
- Header: `border-b border-border/60 px-6 py-5` (`.ds-panel-header`)
- Content: `px-6 py-6`
- Stat card variant: `py-5`, header `pb-4`, value `.ds-stat-value`, caption `mt-1.5 text-xs text-muted-foreground`
- Interactive card: `transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lg`

---

## 8. Inputs

`src/components/ui/input.tsx`: `h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base md:text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30`.

Same focus/disabled/invalid language applies to Select, Textarea, Checkbox, and other form primitives.

---

## 9. Badges & status

`Badge` (`src/components/ui/badge.tsx`): `h-5 w-fit rounded-4xl border border-transparent px-2 text-xs font-medium`, icons `size-3!`. Variants: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`.

Domain statuses (`src/components/common/status-badge.tsx`):
- Rental: `PLACED` amber, `CONFIRMED` blue, `PAID` emerald, `PICKED_UP` violet, `RETURNED` slate, `CANCELLED` red — each `bg-<color>-500/15` with matching dark-aware text.
- Payment: `PENDING` amber, `COMPLETED` emerald, `FAILED` red.
- Built on `variant="outline"` + `border-transparent`; label uses `status.replace(/_/g, " ")`.

---

## 10. Sidebar & navbar

**Navbar** (`src/components/navbar.tsx`): `sticky top-0 z-40 border-b bg-background/80 backdrop-blur`; inner `h-14 max-w-7xl px-4`; links `rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground`.

**Dashboard sidebar** (`src/components/dashboard/dashboard-shell.tsx`): desktop `hidden w-60 shrink-0 border-r bg-muted/30 lg:block` with `sticky top-14 py-4`; nav rows `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground`; active row `bg-primary/10 text-primary`. Mobile bar `sticky top-14 z-30 h-12 border-b bg-background/90 px-4 backdrop-blur lg:hidden`; drawer `w-64 bg-background` with `bg-black/50` overlay; main area `flex-1 p-4 sm:p-6`.

---

## 11. Hover effects & transitions

- Navigation: `transition-colors`, `hover:bg-muted hover:text-foreground`
- Stat cards: `transition-all duration-200`, `hover:-translate-y-0.5`, `hover:border-foreground/15`, `hover:shadow-lg`
- Icon tiles: `transition-colors duration-200`, `group-hover:bg-foreground group-hover:text-background`
- Management rows: `hover:border-border/70 hover:bg-muted/60`
- Row arrow: `transition-transform duration-200 group-hover:translate-x-0.5`
- Chart bars / donut: `transition-[width] duration-500`, `transition-all duration-500`
- Focus: `focus-visible:ring-3 focus-visible:ring-ring/50`
- Respect `motion-reduce:transition-none` where added later.

---

## Usage rules

1. Prefer existing shadcn primitives and `cn()`; do not hand-roll equivalents.
2. Use semantic tokens (`bg-surface-glass`, `border-border-subtle`, `shadow-panel`, `rounded-panel`, `tracking-eyebrow`) or `.ds-*` classes for the premium patterns above.
3. Keep `tabular-nums` on all numeric displays.
4. Every color must come from theme variables so dark mode keeps working.
5. Do not modify the approved admin overview page — it is the visual reference.
6. Apply the system one page at a time, only on explicit approval.
