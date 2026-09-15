import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        neutral: "bg-slate-100 text-slate-700",
        algorithmic: "bg-teal-50 text-teal-800 border border-teal-200",
        sponsored: "bg-amber-50 text-amber-900 border border-amber-300",
        verified: "bg-emerald-50 text-emerald-800 border border-emerald-200",
        pending: "bg-slate-100 text-slate-600 border border-slate-300",
        expired: "bg-red-50 text-red-800 border border-red-200",
        riskLow: "bg-slate-100 text-slate-700",
        riskMedium: "bg-amber-100 text-amber-900",
        riskHigh: "bg-red-100 text-red-900",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
