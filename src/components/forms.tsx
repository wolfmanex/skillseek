"use client";

import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";
import { btnCls } from "@/components/ui";
import type { FormState } from "@/server/form";

export function ActionForm({
  action,
  children,
  className = "space-y-4",
}: {
  action: (prev: FormState, form: FormData) => Promise<FormState>;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} className={className}>
      {state?.error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {children}
    </form>
  );
}

export function SubmitButton({ children, className = btnCls }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {children}
    </button>
  );
}

export function BackField() {
  const pathname = usePathname();
  return <input type="hidden" name="back" value={pathname} />;
}
