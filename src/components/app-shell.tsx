"use client";

import {
  AppSidebar,
  type AppSidebarItem,
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@erp/miniapp-ui";
import {
  ClipboardListIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  MenuIcon,
  TableIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import { APP_SHELL } from "@/constants/nav";

const SIDEBAR_ITEMS: AppSidebarItem[] = [
  { id: "main", label: "Main", type: "section" },
  {
    id: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboardIcon />,
    href: "/dashboard",
  },
  { id: "demos", label: "Demos", type: "section" },
  { id: "/table", label: "Table", href: "/table", icon: <TableIcon /> },
  {
    id: "/requests/new",
    label: "Multi-step form",
    href: "/requests/new",
    icon: <ClipboardListIcon />,
  },
];

function activeNavId(pathname: string): string {
  if (pathname === "/" || pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return "/dashboard";
  }
  if (pathname === "/table" || pathname.startsWith("/table/") || pathname.startsWith("/pipeline")) {
    return "/table";
  }
  if (pathname.startsWith("/requests")) return "/requests/new";
  return "/dashboard";
}

function BrandLogo() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
        UI
      </span>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-semibold text-sidebar-foreground">{APP_SHELL.title}</p>
        <p className="truncate text-[11px] text-muted-foreground">{APP_SHELL.subtitle}</p>
      </div>
    </div>
  );
}

function ShellSidebar({
  activeId,
  onNavigate,
  className,
}: {
  activeId: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <AppSidebar
      className={className}
      items={SIDEBAR_ITEMS}
      activeId={activeId}
      logo={<BrandLogo />}
      navLabel={APP_SHELL.navLabel}
      renderLink={({ item, className: linkClassName, children, isActive, onClick }) => (
        <Link
          href={item.href ?? "#"}
          className={linkClassName}
          aria-current={isActive ? "page" : undefined}
          onClick={(event) => {
            onClick(event);
            onNavigate?.();
          }}
        >
          {children}
        </Link>
      )}
    />
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const activeId = activeNavId(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-surface p-3">
      <div className="flex min-h-0 w-full gap-3">
        <ShellSidebar activeId={activeId} className="hidden md:flex" />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-md border border-border bg-background shadow-sm">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 md:px-4">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className="md:hidden"
                  aria-label={APP_SHELL.openMenu}
                >
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[min(100%,16rem)] border-0 bg-surface p-3">
                <SheetHeader className="sr-only">
                  <SheetTitle>{APP_SHELL.title}</SheetTitle>
                </SheetHeader>
                <ShellSidebar
                  activeId={activeId}
                  className="h-full w-full"
                  onNavigate={() => setMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>
            <p className="flex items-center gap-2 text-sm font-medium text-foreground md:hidden">
              <LayoutTemplateIcon className="size-4" />
              {APP_SHELL.title}
            </p>
            <div className="ms-auto hidden text-xs text-muted-foreground sm:block">
              Mini app · Dreams ERP style
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 md:p-6">
            <main className="flex flex-1 flex-col gap-4">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
