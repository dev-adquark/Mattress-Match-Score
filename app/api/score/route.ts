import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import type { RecommendationResponse, SleepProfile } from "@/contracts/mattress-match";
import { CURRENT_MODEL_VERSION } from "@/lib/scoring/engine";
import { getAllMattresses } from "@/lib/repositories/mattress-repository";
import { buildRecommendations } from "@/lib/recommendations/build-recommendations";
import { sleepProfileInputSchema } from "@/lib/validation/sleep-profile";
import { apiError } from "@/lib/validation/api";
import { saveScoreSession } from "@/lib/repositories/score-session-store";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("VALIDATION_ERROR", "Request body must be valid JSON.");
  }

  const parsed = sleepProfileInputSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "The submitted sleep profile is invalid.", parsed.error.flatten());
  }

  const profile: SleepProfile = {
    ...parsed.data,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  try {
    const candidates = getAllMattresses();
    const recommendations = buildRecommendations(profile, candidates);

    if (recommendations.length > 0) {
      saveScoreSession(profile.id, CURRENT_MODEL_VERSION, recommendations[0].score.trace);
    }

    const response: RecommendationResponse = {
      profileId: profile.id,
      modelVersion: CURRENT_MODEL_VERSION,
      generatedAt: new Date().toISOString(),
      recommendations,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: { "x-profile-id": profile.id },
    });
  } catch (error) {
    return apiError("INTERNAL_ERROR", "Failed to generate recommendations.", {
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
