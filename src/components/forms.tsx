"use client";

import { useActionState, useTransition, type ReactNode } from "react";
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
      {state?.ok && (
        <p role="status" className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
          {state.ok}
        </p>
      )}
      {children}
    </form>
  );
}

/**
 * Like ActionForm, but swaps the whole form for a thank-you panel once the action succeeds.
 * It submits through a transition instead of the form action prop, so a validation error
 * doesn't reset what the visitor already typed.
 */
export function OneShotForm({
  action,
  children,
  submitLabel,
  className = "space-y-4",
}: {
  action: (prev: FormState, form: FormData) => Promise<FormState>;
  children: ReactNode;
  submitLabel: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [, startTransition] = useTransition();
  if (state?.ok) {
    return (
      <p role="status" className="rounded-lg bg-green-50 px-4 py-6 text-center font-medium text-green-800">
        {state.ok}
      </p>
    );
  }
  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => formAction(data));
      }}
    >
      {state?.error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {children}
      <button type="submit" disabled={pending} className={`${btnCls} w-full`}>
        {submitLabel}
      </button>
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
