import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { guideLinks } from "@/lib/content/site-content";

export const metadata: Metadata = {
  title: "Guides",
  description: "In-depth guides on pressure relief, back support, and cooling, grounded in the Match Score methodology.",
};

export default function GuidesIndexPage() {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Guides</h1>
      <p className="mt-3 text-slate-600">
        Deeper dives into specific sleep-fit questions, each one linked back to real, scored mattresses in the
        catalog.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-1">
        {guideLinks.map((guide, idx) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`} className={`group block animate-fadeInUp stagger-${Math.min(idx + 1, 6)}`}>
            <Card className="transition-shadow group-hover:shadow-md">
              <CardHeader>
                <CardTitle className="group-hover:text-teal-700">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{guide.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
