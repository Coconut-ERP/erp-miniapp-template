import { getSite } from "@/lib/api/sites";
import { withApi } from "@/lib/api/route";

export const dynamic = "force-dynamic";

type Params = { id: string };

export const GET = withApi<Params>(async (_request, { id }) => getSite(id));
