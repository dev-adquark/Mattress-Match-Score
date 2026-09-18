import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { QuickMatchForm } from "@/components/forms/quick-match-form";

export const metadata: Metadata = {
  title: "Find My Match",
  description: "Answer a few quick questions about how you sleep to get personalized mattress Match Scores.",
};

export default function MatchPage() {
  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Find My Match</h1>
      <p className="mt-3 text-slate-600">
        Answer six quick questions and we'll score every mattress in our catalog against your sleep profile.
      </p>
      <div className="mt-10">
        <QuickMatchForm />
      </div>
    </Container>
  );
}
