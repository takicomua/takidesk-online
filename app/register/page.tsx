import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth-forms";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getSessionUser } from "@/lib/auth";

export const metadata = {
  title: "Реєстрація",
};

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <>
      <SiteHeader />
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-10 sm:px-8">
        <div className="surface rounded-3xl p-6 sm:p-8">
          <p className="text-sm text-[var(--accent)]">Крок 1 з 3</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Створити акаунт</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Далі скачаєш додаток на ПК і поставиш PWA на телефон.
          </p>

          <RegisterForm />

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
