import { getServiceRequestOptions } from "@/lib/api/service-requests";
import { withApi } from "@/lib/api/route";

export const dynamic = "force-dynamic";

export const GET = withApi(async () => getServiceRequestOptions());
