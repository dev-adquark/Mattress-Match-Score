import type { Metadata } from "next";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Mattress Match Score handles the sleep profile information you provide.",
};

export default function PrivacyPage() {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Privacy Policy</h1>
      <p className="mt-3 text-slate-600">Last updated 2026-09-01.</p>

      <div className="mt-6 space-y-6 text-slate-600">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">What we store</h2>
          <p className="mt-2">
            Your sleep profile answers (sleep position, weight range, firmness preference, budget, temperature
            preference, motion sensitivity, and any optional fields you provide) are stored in your browser's local
            storage so your results persist across visits and page refreshes. We do not require an account and do
            not attach your profile to your identity.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-900">What we don't do</h2>
          <p className="mt-2">
            We don't sell your sleep profile data. We don't use it for anything other than generating your Match
            Score recommendations.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Analytics</h2>
          <p className="mt-2">
            If an analytics provider is configured for this deployment, anonymized product-usage events (such as
            which step of the match flow you reached, or whether you clicked an affiliate link) may be recorded.
            The app functions identically with analytics disabled.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Third-party links</h2>
          <p className="mt-2">
            Affiliate links take you to third-party retailer sites with their own privacy policies, which we don't
            control.
          </p>
        </section>
      </div>
    </Container>
  );
}
