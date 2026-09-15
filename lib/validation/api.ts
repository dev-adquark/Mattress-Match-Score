import { z } from "zod";
import { NextResponse } from "next/server";
import type { ApiErrorCode, ApiErrorResponse } from "@/contracts/mattress-match";

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  VALIDATION_ERROR: 400,
  INVALID_PROFILE: 400,
  INVALID_TOPIC: 404,
  MATTRESS_NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

export function apiError(code: ApiErrorCode, message: string, details?: unknown) {
  const body: ApiErrorResponse = {
    error: { code, message, ...(details !== undefined ? { details } : {}) },
  };
  return NextResponse.json(body, { status: STATUS_BY_CODE[code] });
}

function isValidDateString(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

export const verifySponsoredInputSchema = z.object({
  placementId: z.string().min(1, "placementId is required"),
  verificationStatus: z.enum(["verified", "pending", "expired"]),
  verifiedAt: z
    .string()
    .nullable()
    .optional()
    .refine((value) => value === null || value === undefined || isValidDateString(value), {
      message: "verifiedAt must be a valid date string or null",
    }),
});

export type VerifySponsoredInput = z.infer<typeof verifySponsoredInputSchema>;
