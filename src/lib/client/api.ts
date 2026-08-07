export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Browser → app API routes. Add initData header when embedding in ERP. */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(response.status, body?.error ?? response.statusText);
  }

  return response.json() as Promise<T>;
}

export const apiJson = <T>(path: string, method: string, body: unknown): Promise<T> =>
  api<T>(path, { method, body: JSON.stringify(body) });
