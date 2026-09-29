import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth-forms";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getSessionUser } from "@/lib/auth";

export const metadata = {
  title: "Увійти",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <>
      <SiteHeader />
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-10 sm:px-8">
        <div className="surface rounded-3xl p-6 sm:p-8">
          <h1 className="font-display text-3xl font-bold tracking-tight">Увійти</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Доступ до кабінету takiDesk Online.
          </p>

          <LoginForm />

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
