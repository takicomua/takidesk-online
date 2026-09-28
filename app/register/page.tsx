import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { registerAction } from "@/lib/actions";
import { getSessionUser } from "@/lib/auth";

export const metadata = {
  title: "Реєстрація",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  const params = await searchParams;
  const error = params.error;

  return (
    <>
      <SiteHeader />
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-10 sm:px-8">
        <div className="surface rounded-3xl p-6 sm:p-8">
          <h1 className="font-display text-3xl font-bold tracking-tight">Створити акаунт</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Після реєстрації відкриється кабінет із завантаженням для ПК і PWA.
          </p>

          {error ? (
            <p className="mt-4 rounded-2xl border border-[color-mix(in_oklab,var(--danger)_45%,transparent)] bg-[color-mix(in_oklab,var(--danger)_12%,transparent)] px-3 py-2 text-sm text-[#ffb4b4]">
              {error}
            </p>
          ) : null}

          <form action={registerAction} className="mt-6 space-y-4">
            <label className="block space-y-2 text-sm">
              <span className="text-[var(--muted)]">Імʼя</span>
              <input className="field" name="name" required minLength={2} autoComplete="name" />
            </label>
            <label className="block space-y-2 text-sm">
              <span className="text-[var(--muted)]">Email</span>
              <input
                className="field"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span className="text-[var(--muted)]">Пароль</span>
              <input
                className="field"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>
            <button type="submit" className="btn btn-primary w-full">
              Зареєструватись
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[var(--muted)]">
            Вже є акаунт?{" "}
            <Link href="/login" className="text-[var(--accent)]">
              Увійти
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
