import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  MessageSquareQuote,
  Package,
  Tags,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function navItems(role: Role): NavItem[] {
  const profile: NavItem = { href: "/profile", label: "Profile", icon: User };

  switch (role) {
    case "ADMIN":
      return [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/categories", label: "Categories", icon: Tags },
        { href: "/admin/gear", label: "Gear", icon: Package },
        { href: "/admin/rentals", label: "Rentals", icon: CalendarDays },
        profile,
      ];
    case "PROVIDER":
      return [
        { href: "/provider", label: "Overview", icon: LayoutDashboard },
        { href: "/provider/gear", label: "My Gear", icon: Package },
        { href: "/provider/orders", label: "Orders", icon: ClipboardList },
        profile,
      ];
    default:
      return [
        { href: "/customer", label: "Overview", icon: LayoutDashboard },
        { href: "/customer/rentals", label: "My Rentals", icon: CalendarDays },
        { href: "/customer/payments", label: "Payments", icon: CreditCard },
        { href: "/customer/reviews", label: "My Reviews", icon: MessageSquareQuote },
        profile,
      ];
  }
}
