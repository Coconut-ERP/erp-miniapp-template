import type { NextRequest } from "next/server";
import { errorResponse } from "./errors";

type Handler<P> = (request: NextRequest, params: P) => Promise<unknown>;

/** Replace with withWorkshop / initData when wiring ERP — see examples/miniapp-workshop. */
export function withApi<P = unknown>(handler: Handler<P>) {
  return async (request: NextRequest, routeContext: { params: Promise<P> }): Promise<Response> => {
    try {
      const data = await handler(request, await routeContext.params);
      return Response.json(data);
    } catch (error) {
      return errorResponse(error);
    }
  };
}
