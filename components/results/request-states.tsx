import Link from "next/link";
import { AlertCircle, Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoadingState({ label = "Scoring mattresses against your profile…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white py-16 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-teal-600" aria-hidden="true" />
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 py-16 text-center">
      <AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
      <p className="max-w-md text-sm font-medium text-red-800">{message}</p>
      <Button variant="destructive" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

export function NoProfileEmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <SearchX className="h-8 w-8 text-slate-400" aria-hidden="true" />
      <p className="max-w-md text-sm font-medium text-slate-600">
        We don&rsquo;t have a sleep profile for you yet. Start the quick match to see personalized recommendations.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/match">Find My Match</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/match/full">Full profile</Link>
        </Button>
      </div>
    </div>
  );
}
