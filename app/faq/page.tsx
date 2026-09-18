import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { faqLinks } from "@/lib/content/site-content";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about firmness, trial periods, durability, motion isolation, cooling, and more.",
};

export default function FaqIndexPage() {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h1>
      <p className="mt-3 text-slate-600">
        Straightforward answers grounded in the same methodology used to generate your Match Score.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {faqLinks.map((faq, idx) => (
          <Link key={faq.slug} href={`/faq/${faq.slug}`} className={`group block animate-fadeInUp stagger-${Math.min(idx + 1, 6)}`}>
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base group-hover:text-teal-700">{faq.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{faq.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
