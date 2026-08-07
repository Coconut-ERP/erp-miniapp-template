import { listSites } from "@/lib/api/sites";
import { withApi } from "@/lib/api/route";

export const dynamic = "force-dynamic";

export const GET = withApi(async () => listSites());
