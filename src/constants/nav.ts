export const APP_SHELL = {
  title: "UI Kit",
  subtitle: "Mini app · @erp/miniapp-ui",
  navLabel: "Navigation",
  openMenu: "Open menu",
} as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/table", label: "Table" },
  { href: "/requests/new", label: "Multi-step form" },
] as const;
