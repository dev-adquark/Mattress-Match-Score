import type { ApiErrorResponse, RecommendationResponse } from "@/contracts/mattress-match";
import type { SleepProfileInput } from "@/lib/validation/sleep-profile";

export class ApiRequestError extends Error {
  code: string;
  details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

async function parseJsonOrThrow<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const errorBody = data as ApiErrorResponse | null;
    throw new ApiRequestError(
      errorBody?.error?.code ?? "INTERNAL_ERROR",
      errorBody?.error?.message ?? "Something went wrong. Please try again.",
      errorBody?.error?.details
    );
  }
  return data as T;
}

export async function fetchScore(profileInput: SleepProfileInput): Promise<RecommendationResponse> {
  const response = await fetch("/api/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileInput),
  });
  return parseJsonOrThrow<RecommendationResponse>(response);
}
