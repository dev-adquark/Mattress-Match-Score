import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { FullProfileForm } from "@/components/forms/full-profile-form";

export const metadata: Metadata = {
  title: "Full Sleep Profile",
  description: "Build a detailed sleep profile for the most precise mattress Match Scores.",
};

export default function FullProfilePage() {
  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Full Sleep Profile</h1>
      <p className="mt-3 text-slate-600">
        A few extra questions sharpen every sub-score and risk flag. This takes about two minutes.
      </p>
      <div className="mt-10">
        <FullProfileForm />
      </div>
    </Container>
  );
}
