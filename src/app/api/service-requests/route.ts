import type { NextRequest } from "next/server";
import { createServiceRequest } from "@/lib/api/service-requests";
import { withApi } from "@/lib/api/route";
import type { ServiceRequestInput } from "@/domain/types";

export const dynamic = "force-dynamic";

export const POST = withApi(async (request: NextRequest) => {
  const body = (await request.json()) as ServiceRequestInput;
  return createServiceRequest(body);
});
