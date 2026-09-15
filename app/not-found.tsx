import Link from "next/link";
import { SearchX } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <SearchX className="h-12 w-12 text-slate-300" aria-hidden="true" />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-600">
        We couldn&rsquo;t find the page you were looking for. It may have moved, or the link may be out of date.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/match">Find My Match</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/compare">Compare mattresses</Link>
        </Button>
      </div>
    </Container>
  );
}
