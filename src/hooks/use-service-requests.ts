"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, apiJson } from "@/lib/client/api";
import type {
  ServiceRequestFormOptions,
  ServiceRequestInput,
  ServiceRequestResult,
} from "@/domain/types";

export function useServiceRequestFormOptions() {
  return useQuery({
    queryKey: ["service-request-options"],
    queryFn: () => api<ServiceRequestFormOptions>("/api/service-requests/options"),
  });
}

export function useSubmitServiceRequest() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: ServiceRequestInput) =>
      apiJson<ServiceRequestResult>("/api/service-requests", "POST", input),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["service-request-options"] });
    },
  });
}
