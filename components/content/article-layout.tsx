import Link from "next/link";
import { Container } from "@/components/layout/container";

interface ArticleLayoutProps {
  eyebrow: string;
  eyebrowHref: string;
  title: string;
  dek?: string;
  children: React.ReactNode;
  relatedLinks?: { href: string; label: string }[];
}

export function ArticleLayout({ eyebrow, eyebrowHref, title, dek, children, relatedLinks }: ArticleLayoutProps) {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href={eyebrowHref} className="hover:text-teal-700">
          {eyebrow}
        </Link>{" "}
        / <span className="text-slate-700">{title}</span>
      </nav>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      {dek && <p className="mt-3 text-slate-600">{dek}</p>}
      <div className="prose-slate mt-6 space-y-4 text-slate-600 [&_a]:text-teal-700 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-slate-800">
        {children}
      </div>
      {relatedLinks && relatedLinks.length > 0 && (
        <div className="mt-10 border-t border-slate-200 pt-6">
          <h2 className="text-sm font-semibold text-slate-900">Related</h2>
          <ul className="mt-2 space-y-1">
            {relatedLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-teal-700 hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}
