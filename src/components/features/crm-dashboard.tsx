"use client";

import {
  Badge,
  BarChart,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DashboardCard,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  PageHeader,
  Progress,
  StatisticCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erp/miniapp-ui";
import {
  BriefcaseIcon,
  ChevronDownIcon,
  CircleDollarSignIcon,
  TargetIcon,
  UsersIcon,
} from "lucide-react";
import { CRM_DASHBOARD_PAGE } from "@/constants/crm-dashboard";

const KPI_ICONS = {
  leads: UsersIcon,
  deals: BriefcaseIcon,
  opps: TargetIcon,
  revenue: CircleDollarSignIcon,
} as const;

const SOURCE_COLORS = [
  "bg-primary",
  "bg-sky-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-emerald-500",
] as const;

function leadStatusVariant(status: string) {
  if (status === "Closed") return "default" as const;
  if (status === "Lost") return "destructive" as const;
  if (status === "Contacted") return "secondary" as const;
  return "outline" as const;
}

function dealTagVariant(tag: string) {
  if (tag === "Won") return "default" as const;
  if (tag === "Lost") return "destructive" as const;
  return "secondary" as const;
}

function contactStatusVariant(status: string) {
  return status === "Active" ? ("default" as const) : ("outline" as const);
}

export function CrmDashboard() {
  const copy = CRM_DASHBOARD_PAGE;

  return (
    <>
      <PageHeader
        title={copy.header.title}
        description={copy.header.description}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                {copy.export}
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{copy.exportPdf}</DropdownMenuItem>
              <DropdownMenuItem>{copy.exportExcel}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {copy.kpis.map((kpi) => {
          const Icon = KPI_ICONS[kpi.id];
          return (
            <StatisticCard
              key={kpi.id}
              label={kpi.label}
              value={kpi.value}
              trend={kpi.trend}
              trendLabel={copy.fromLastWeek}
              icon={<Icon />}
            />
          );
        })}
      </div>

      <div className="grid gap-3 xl:grid-cols-12">
        <DashboardCard
          className="xl:col-span-5"
          title={copy.recentLeads.title}
          action={
            <Button type="button" variant="link" size="sm" className="h-auto px-0">
              {copy.viewAll}
            </Button>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{copy.recentLeads.columns.lead}</TableHead>
                <TableHead>{copy.recentLeads.columns.owner}</TableHead>
                <TableHead>{copy.recentLeads.columns.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {copy.recentLeads.rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{row.name}</p>
                      <p className="text-xs text-muted-foreground">{row.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.owner}</TableCell>
                  <TableCell>
                    <Badge variant={leadStatusVariant(row.status)}>{row.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DashboardCard>

        <DashboardCard className="xl:col-span-7" title={copy.leadsGenerated.title}>
          <BarChart
            categories={copy.leadsGenerated.months}
            series={[
              {
                name: copy.leadsGenerated.expected,
                data: copy.leadsGenerated.expectedSeries,
                className: "bg-muted-foreground/30",
              },
              {
                name: copy.leadsGenerated.generated,
                data: copy.leadsGenerated.generatedSeries,
                className: "bg-primary",
              },
            ]}
            showLegend
            height={192}
            aria-label={copy.leadsGenerated.title}
          />
        </DashboardCard>
      </div>

      <div className="grid gap-3 xl:grid-cols-12">
        <DashboardCard
          className="xl:col-span-7"
          title={copy.recentDeals.title}
          action={
            <Button type="button" variant="link" size="sm" className="h-auto px-0">
              {copy.viewAll}
            </Button>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{copy.recentDeals.columns.id}</TableHead>
                <TableHead>{copy.recentDeals.columns.name}</TableHead>
                <TableHead>{copy.recentDeals.columns.stage}</TableHead>
                <TableHead>{copy.recentDeals.columns.probability}</TableHead>
                <TableHead>{copy.recentDeals.columns.tags}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {copy.recentDeals.rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-primary">{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.stage}</TableCell>
                  <TableCell>{row.probability}</TableCell>
                  <TableCell>
                    <Badge variant={dealTagVariant(row.tag)}>{row.tag}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DashboardCard>

        <DashboardCard className="xl:col-span-5" title={copy.pipeline.title}>
          <div className="space-y-3">
            {copy.pipeline.stages.map((stage) => (
              <div key={stage.label} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">{stage.label}</span>
                  <span className="font-medium tabular-nums">{stage.value}</span>
                </div>
                <Progress value={(stage.value / stage.max) * 100} />
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-3 xl:grid-cols-12">
        <Card className="xl:col-span-5">
          <CardHeader className="border-b">
            <CardTitle className="text-base font-semibold">{copy.sources.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {copy.sources.items.map((item, index) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <span
                      className={`size-2 rounded-full ${SOURCE_COLORS[index % SOURCE_COLORS.length]}`}
                    />
                    {item.label}
                  </span>
                  <span className="font-medium tabular-nums">{item.value}%</span>
                </div>
                <Progress
                  value={item.value}
                  indicatorClassName={SOURCE_COLORS[index % SOURCE_COLORS.length]}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <DashboardCard
          className="xl:col-span-7"
          title={copy.recentContacts.title}
          action={
            <Button type="button" variant="link" size="sm" className="h-auto px-0">
              {copy.viewAll}
            </Button>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{copy.recentContacts.columns.id}</TableHead>
                <TableHead>{copy.recentContacts.columns.contact}</TableHead>
                <TableHead>{copy.recentContacts.columns.phone}</TableHead>
                <TableHead>{copy.recentContacts.columns.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {copy.recentContacts.rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-primary">{row.id}</TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.phone}</TableCell>
                  <TableCell>
                    <Badge variant={contactStatusVariant(row.status)}>{row.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DashboardCard>
      </div>
    </>
  );
}
