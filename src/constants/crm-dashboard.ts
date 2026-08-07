/**
 * CRM dashboard demo copy — mirrors Dreams ERP crm-dashboard.html structure.
 */
export const CRM_DASHBOARD_PAGE = {
  header: {
    title: "CRM Dashboard",
    description: "Leads, deals, pipeline, and contacts — Dreams ERP layout via @erp/miniapp-ui.",
  },
  export: "Export",
  exportPdf: "Export as PDF",
  exportExcel: "Export as Excel",
  viewAll: "View All",
  fromLastWeek: "from last week",
  kpis: [
    { id: "leads", label: "Total Leads", value: "$125,000", trend: 12.4 },
    { id: "deals", label: "Total Deals Closed", value: "$154,000", trend: 5.3 },
    { id: "opps", label: "Total Opportunities", value: "$185,000", trend: -4.35 },
    { id: "revenue", label: "Total Revenue", value: "$210,000", trend: 11.8 },
  ],
  recentLeads: {
    title: "Recent Leads",
    columns: { lead: "Lead", owner: "Lead Owner", status: "Status" },
    rows: [
      { id: "#LED0020", name: "Robert Cosper", owner: "Ethan Walker", status: "Closed" },
      { id: "#LED0019", name: "Helen Nelson", owner: "Madison Clark", status: "Not Closed" },
      { id: "#LED0018", name: "Thomas Neal", owner: "James Harris", status: "Contacted" },
      { id: "#LED0017", name: "Sarah Spivey", owner: "Avery Thompson", status: "Lost" },
      { id: "#LED0016", name: "Jared Griffin", owner: "Benjamin Wright", status: "Closed" },
    ],
  },
  leadsGenerated: {
    title: "Leads Generated",
    expected: "No of Leads Expected",
    generated: "No of Leads Generated",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    expectedSeries: [42, 55, 48, 70, 62, 80, 74, 90],
    generatedSeries: [30, 40, 38, 52, 50, 68, 60, 78],
  },
  recentDeals: {
    title: "Recent Deals",
    columns: { id: "ID", name: "Deal Name", stage: "Stage", probability: "Probability", tags: "Tags" },
    rows: [
      { id: "#DEL0020", name: "CRM Subscription", stage: "Qualify To Buy", probability: "90%", tag: "Open" },
      { id: "#DEL0019", name: "ERP Implementation", stage: "Contact Made", probability: "40%", tag: "Won" },
      { id: "#DEL0018", name: "Cloud Migration", stage: "Presentation", probability: "60%", tag: "Lost" },
      { id: "#DEL0017", name: "Cybersecurity Upgrade", stage: "Proposal Made", probability: "50%", tag: "Won" },
      { id: "#DEL0016", name: "SaaS Renewal", stage: "Appointment", probability: "70%", tag: "Lost" },
    ],
  },
  pipeline: {
    title: "Deals Pipeline",
    stages: [
      { label: "Qualify To Buy", value: 1100, max: 1100 },
      { label: "Contact Made", value: 800, max: 1100 },
      { label: "Presentation", value: 700, max: 1100 },
      { label: "Proposal Made", value: 550, max: 1100 },
      { label: "Appointment", value: 430, max: 1100 },
      { label: "Won", value: 320, max: 1100 },
      { label: "Lost", value: 210, max: 1100 },
    ],
  },
  sources: {
    title: "Contact By Sources",
    items: [
      { label: "Organic Search", value: 25 },
      { label: "Campaigns", value: 15 },
      { label: "Referral", value: 15 },
      { label: "Marketing", value: 10 },
      { label: "Paid Social", value: 15 },
      { label: "Events", value: 20 },
    ],
  },
  recentContacts: {
    title: "Recent Contacts",
    columns: { id: "ID", contact: "Contact", phone: "Phone Number", status: "Status" },
    rows: [
      { id: "#CON0020", name: "Ethan Walker", phone: "+1 (212) 555-0174", status: "Active" },
      { id: "#CON0019", name: "Madison Clark", phone: "+1 (312) 555-0148", status: "Inactive" },
      { id: "#CON0018", name: "James Harris", phone: "+1 (415) 555-0123", status: "Active" },
      { id: "#CON0017", name: "Avery Thompson", phone: "+1 (305) 555-0189", status: "Active" },
    ],
  },
} as const;
