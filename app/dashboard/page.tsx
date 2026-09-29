import { redirect } from "next/navigation";
import { InstallPwaButton } from "@/components/install-pwa";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getSessionUser } from "@/lib/auth";
import { getDownloadLinks } from "@/lib/site";

export const metadata = {
  title: "Кабінет",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const downloads = getDownloadLinks();

  return (
    <>
      <SiteHeader userName={user.name} />
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm uppercase tracking-[0.16em] text-[var(--muted)]">Кабінет</p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Привіт, {user.name}
          </h1>
          <p className="text-[var(--muted)]">
            Три кроки — і ти на звʼязку зі своїм ПК. Стрім іде з твого компʼютера, не через наші
            сервери.
          </p>
        </div>

        <ol className="mt-10 grid gap-5 lg:grid-cols-3">
          <li className="surface rounded-3xl p-6 sm:p-7">
            <p className="text-sm text-[var(--accent)]">Крок 1 · готово</p>
            <h2 className="mt-2 font-display text-2xl font-bold">Акаунт</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Ти вже зареєстрований. Email:{" "}
              <span className="text-[var(--fg)]">{user.email}</span>
            </p>
            <p className="mt-4 text-sm text-[var(--teal)]">✓ Виконано</p>
          </li>

          <li className="surface rounded-3xl p-6 sm:p-7">
            <p className="text-sm text-[var(--accent)]">Крок 2</p>
            <h2 className="mt-2 font-display text-2xl font-bold">Додаток на ПК</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Розпакуй архів, запусти takiDesk.exe — на екрані зʼявиться твій особистий PIN і
              QR-код.
            </p>
            <a href={downloads.pc} className="btn btn-primary mt-6" rel="noopener noreferrer">
              Завантажити для Windows
            </a>
          </li>

          <li className="surface rounded-3xl p-6 sm:p-7">
            <p className="text-sm text-[var(--teal)]">Крок 3</p>
            <h2 className="mt-2 font-display text-2xl font-bold">PWA на телефон</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Встанови цей сайт як додаток або постав Android-клієнт, потім введи PIN з ПК.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <InstallPwaButton />
              <a
                href={downloads.android}
                className="btn btn-ghost w-full sm:w-auto"
                rel="noopener noreferrer"
              >
                Android APK
              </a>
            </div>
          </li>
        </ol>

        <section className="surface mt-5 rounded-3xl p-6 sm:p-7">
          <h2 className="font-display text-2xl font-bold">Як користуватись</h2>
          <ol className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li>1. ПК увімкнений, takiDesk запущений.</li>
            <li>2. На телефоні відкрий takiDesk (APK) або відскануй QR-код з екрана ПК.</li>
            <li>3. Введи свій PIN. Для доступу поза домом натисни «Інтернет» на ПК і задай пароль.</li>
          </ol>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
