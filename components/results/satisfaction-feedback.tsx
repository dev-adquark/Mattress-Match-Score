"use client";

import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { trackEvent } from "@/lib/analytics/events";

export function SatisfactionFeedback({ mattressId }: { mattressId: string }) {
  const [response, setResponse] = useState<"yes" | "no" | null>(null);

  function respond(value: "yes" | "no") {
    setResponse(value);
    trackEvent("satisfaction_response", { mattressId, response: value });
  }

  if (response) {
    return <p className="text-xs text-slate-500">Thanks for the feedback — it helps us improve future matches.</p>;
  }

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span>Was this a good match?</span>
      <button
        type="button"
        onClick={() => respond("yes")}
        className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1 font-medium text-slate-600 hover:border-teal-300 hover:text-teal-700"
      >
        <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" /> Yes
      </button>
      <button
        type="button"
        onClick={() => respond("no")}
        className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1 font-medium text-slate-600 hover:border-red-300 hover:text-red-700"
      >
        <ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" /> Not really
      </button>
    </div>
  );
}
