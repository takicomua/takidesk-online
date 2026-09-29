import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loginAction } from "@/lib/actions";
import { getSessionUser, readFlash } from "@/lib/auth";

export const metadata = {
  title: "Увійти",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  const error = await readFlash();

  return (
    <>
      <SiteHeader />
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-10 sm:px-8">
        <div className="surface rounded-3xl p-6 sm:p-8">
          <h1 className="font-display text-3xl font-bold tracking-tight">Увійти</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Доступ до кабінету takiDesk Online.
          </p>

          {error ? (
            <p
              role="alert"
              className="mt-4 rounded-2xl border border-[color-mix(in_oklab,var(--danger)_45%,transparent)] bg-[color-mix(in_oklab,var(--danger)_12%,transparent)] px-3 py-2 text-sm text-[#ffb4b4]"
            >
              {error}
            </p>
          ) : null}

          <form action={loginAction} className="mt-6 space-y-4">
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
                autoComplete="current-password"
              />
            </label>
            <button type="submit" className="btn btn-primary w-full">
              Увійти
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[var(--muted)]">
            Немає акаунта?{" "}
            <Link href="/register" className="text-[var(--accent)]">
              Реєстрація
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
