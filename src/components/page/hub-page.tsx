"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
} from "@erp/miniapp-ui";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { HUB_PAGE } from "@/constants/pages";

const DEMOS = [
  {
    href: "/dashboard",
    title: "HRM Dashboard",
    description: "Workforce, distribution, attendance, payroll, recruitment — Dreams HRM layout.",
    entry: "components/features/hrm-dashboard.tsx",
  },
  {
    href: "/table",
    title: "Table",
    description: "CRUD table + dialogs (Dreams pipeline) and data panels moved from the dashboard.",
    entry: "components/page/pipeline-page.tsx",
  },
  {
    href: "/requests/new",
    title: "Multi-step form",
    description: "Wizard, validation, conditional fields, review, POST /api/service-requests.",
    entry: "components/features/service-request-form.tsx",
  },
] as const;

const LAYOUT = [
  { path: "app/", note: "Routes — page.tsx stays Server Components" },
  { path: "components/page/", note: "Client page bodies (*-page.tsx)" },
  { path: "components/features/", note: "Domain UI composed from @erp/miniapp-ui" },
  { path: "components/app-shell.tsx", note: "Compose library AppSidebar + Sheet (mobile)" },
  { path: "constants/", note: "nav.ts, pages.ts — copy only, no data" },
  { path: "hooks/", note: "React Query — call lib/client/api" },
  { path: "lib/api/", note: "Server domain logic + seed (replace with ERP)" },
  { path: "lib/client/", note: "Browser fetch helper" },
  { path: "domain/types.ts", note: "DTOs shared by API and UI" },
  { path: "app/api/", note: "Next.js route handlers" },
] as const;

export function HubPage() {
  return (
    <>
      <PageHeader title={HUB_PAGE.title} description={HUB_PAGE.description} />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Live demos
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {DEMOS.map((item) => (
            <Card key={item.href}>
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Entry:</span>{" "}
                  <code className="rounded bg-muted px-1 py-0.5">{item.entry}</code>
                </p>
                <Button asChild size="sm" className="gap-2">
                  <Link href={item.href}>
                    Open demo
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Clone this layout
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Standard mini app folders</CardTitle>
            <CardDescription>
              Copy the whole <code className="text-xs">examples/miniapp-ui-kit</code> project, then
              replace <code className="text-xs">lib/api/seed.ts</code> with ERP reads.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {LAYOUT.map((item) => (
                <li key={item.path} className="flex flex-wrap gap-x-2">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.path}</code>
                  <span className="text-muted-foreground">{item.note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
