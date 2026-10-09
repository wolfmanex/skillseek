import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export const inputCls =
  "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";

export const btnCls =
  "inline-flex items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 shadow-sm hover:bg-amber-400 disabled:opacity-60";

export const btnSecondaryCls =
  "inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50 disabled:opacity-60";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-stone-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function Badge({ children, tone = "stone" }: { children: ReactNode; tone?: "stone" | "amber" | "green" | "blue" | "red" }) {
  const tones = {
    stone: "bg-stone-100 text-stone-700",
    amber: "bg-amber-100 text-amber-800",
    green: "bg-green-100 text-green-800",
    blue: "bg-sky-100 text-sky-800",
    red: "bg-red-100 text-red-800",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-stone-800">{label}</span>
      {children}
      {hint && <span className="block text-xs text-stone-500">{hint}</span>}
    </label>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-stone-600">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function ButtonLink({ secondary, ...props }: ComponentProps<typeof Link> & { secondary?: boolean }) {
  return <Link {...props} className={secondary ? btnSecondaryCls : btnCls} />;
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">{children}</p>;
}

export function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="text-amber-500" aria-label={`${value.toFixed(1)} / 5`}>
      {"★".repeat(full)}
      <span className="text-stone-300">{"★".repeat(5 - full)}</span>
    </span>
  );
}
