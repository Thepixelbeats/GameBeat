import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Compass,
  Gamepad2,
  Home,
  Library,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";

export type AppNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const primaryNavItems: AppNavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/backlog",
    label: "Backlog",
    icon: Library,
  },
  {
    href: "/discover",
    label: "Discover",
    icon: Compass,
  },
  {
    href: "/recommendations",
    label: "Recommendations",
    icon: Star,
  },
  {
    href: "/tonight",
    label: "Tonight",
    icon: Sparkles,
  },
  {
    href: "/stats",
    label: "Stats",
    icon: BarChart3,
  },
];

export const secondaryNavItems: AppNavItem[] = [
  {
    href: "/settings",
    label: "Settings",
    icon: UserRound,
  },
];

export const appIdentity = {
  name: "GameFlow",
  icon: Gamepad2,
};
