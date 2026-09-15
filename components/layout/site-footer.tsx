import Link from "next/link";
import { getAllComparisonTopics } from "@/lib/repositories/comparison-topic-repository";
import { guideLinks } from "@/lib/content/site-content";

export function SiteFooter() {
  const topics = getAllComparisonTopics();

  const columns: { title: string; links: { href: string; label: string }[] }[] = [
    {
      title: "Get matched",
      links: [
        { href: "/match", label: "Quick match" },
        { href: "/match/full", label: "Full sleep profile" },
        { href: "/results", label: "Your results" },
      ],
    },
    {
      title: "Compare",
      links: [
        { href: "/compare", label: "All comparisons" },
        ...topics.map((t) => ({ href: `/compare/${t.slug}`, label: t.title })),
      ],
    },
    {
      title: "Guides",
      links: [
        { href: "/guides", label: "All guides" },
        ...guideLinks.map((g) => ({ href: `/guides/${g.slug}`, label: g.title })),
      ],
    },
    {
      title: "Trust & methodology",
      links: [
        { href: "/methodology", label: "Methodology" },
        { href: "/sponsored-policy", label: "Sponsored policy" },
        { href: "/affiliate-disclosure", label: "Affiliate disclosure" },
        { href: "/faq", label: "FAQ" },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-slate-900">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-600 hover:text-teal-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Mattress Match Score. Match scores are decision-support estimates, not
            guarantees. See our{" "}
            <Link href="/methodology" className="underline hover:text-teal-700">
              methodology
            </Link>
            .
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-teal-700">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-teal-700">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
