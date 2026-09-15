import { NextRequest, NextResponse } from "next/server";
import { getScoreSession } from "@/lib/repositories/score-session-store";
import { apiError } from "@/lib/validation/api";

export async function GET(request: NextRequest) {
  const profileId = request.nextUrl.searchParams.get("profileId");

  if (!profileId) {
    return apiError("VALIDATION_ERROR", "A profileId query parameter is required.");
  }

  const session = getScoreSession(profileId);
  if (!session) {
    return apiError(
      "INVALID_PROFILE",
      `No score trace found for profileId "${profileId}". Generate a recommendation via /api/score first.`
    );
  }

  return NextResponse.json({
    modelVersion: session.modelVersion,
    trace: session.trace,
  });
}
