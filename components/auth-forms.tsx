"use client";

import { useActionState } from "react";
import { loginAction, registerAction, type FormState } from "@/lib/actions";

const initial: FormState = { error: null };

function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="mt-4 rounded-2xl border border-[color-mix(in_oklab,var(--danger)_45%,transparent)] bg-[color-mix(in_oklab,var(--danger)_12%,transparent)] px-3 py-2 text-sm text-[#ffb4b4]"
    >
      {message}
    </p>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <>
      <ErrorBanner message={state.error} />
      <form action={action} className="mt-6 space-y-4">
        <label className="block space-y-2 text-sm">
          <span className="text-[var(--muted)]">Email</span>
          <input className="field" name="email" type="email" required autoComplete="email" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="text-[var(--muted)]">Пароль</span>
          <input
            className="field"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </label>
        <button type="submit" className="btn btn-primary w-full" disabled={pending}>
          {pending ? "Вхід…" : "Увійти"}
        </button>
      </form>
    </>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initial);

  return (
    <>
      <ErrorBanner message={state.error} />
      <form action={action} className="mt-6 space-y-4">
        <label className="block space-y-2 text-sm">
          <span className="text-[var(--muted)]">Імʼя</span>
          <input className="field" name="name" required minLength={2} autoComplete="name" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="text-[var(--muted)]">Email</span>
          <input className="field" name="email" type="email" required autoComplete="email" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="text-[var(--muted)]">Пароль (літери + цифри, мін. 8)</span>
          <input
            className="field"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <button type="submit" className="btn btn-primary w-full" disabled={pending}>
          {pending ? "Створюємо…" : "Зареєструватись"}
        </button>
      </form>
    </>
  );
}
