import type {
  DriftReport,
  EvalMetrics,
  LlmComparison,
  ModelComparison,
  PredictionResponse,
  ProviderSummary,
} from "./types";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new ApiError(response.status, text || response.statusText);
  }
  return (await response.json()) as T;
}

export const api = {
  health: () => request<{ status: string; version: string; fixtures: Record<string, boolean> }>("/health"),
  getDemoProviders: () => request<ProviderSummary[]>("/api/demo-providers"),
  predict: (providerId: string) =>
    request<PredictionResponse>("/api/predict", {
      method: "POST",
      body: JSON.stringify({ provider_id: providerId }),
    }),
  getMetrics: () => request<EvalMetrics>("/api/metrics"),
  getModelComparison: () => request<ModelComparison>("/api/model-comparison"),
  getLlmComparison: () => request<LlmComparison>("/api/llm-comparison"),
  getDrift: () => request<DriftReport>("/api/drift"),
};

export { ApiError };
