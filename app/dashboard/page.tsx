import { redirect } from "next/navigation";
import { InstallPwaButton } from "@/components/install-pwa";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getSessionUser } from "@/lib/auth";
import { getDownloadLinks } from "@/lib/site";

export const metadata = {
  title: "Кабінет",
};

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
            Скачай додаток на ПК і постав PWA на телефон. Підключення працює через твій
            компʼютер — без навантаження на наші сервери.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <section className="surface rounded-3xl p-6 sm:p-7">
            <p className="text-sm text-[var(--accent)]">01 · Windows</p>
            <h2 className="mt-2 font-display text-2xl font-bold">Додаток для ПК</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Встанови takiDesk на компʼютер, увійди тим самим акаунтом (або запусти агент)
              і тримай ПК онлайн, коли хочеш підключатись.
            </p>
            <a
              href={downloads.pc}
              className="btn btn-primary mt-6"
              target="_blank"
              rel="noreferrer"
            >
              Завантажити для Windows
            </a>
          </section>

          <section className="surface rounded-3xl p-6 sm:p-7">
            <p className="text-sm text-[var(--teal)]">02 · Телефон</p>
            <h2 className="mt-2 font-display text-2xl font-bold">PWA на телефон</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Відкрий цей сайт у Chrome / Safari і встанови як додаток. Так takiDesk Online
              завжди під рукою з головного екрану.
            </p>
            <div className="mt-6">
              <InstallPwaButton />
            </div>
          </section>
        </div>

        <section className="surface mt-5 rounded-3xl p-6 sm:p-7">
          <h2 className="font-display text-2xl font-bold">Швидкий старт</h2>
          <ol className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li>1. Встанови takiDesk на ПК і залиш його запущеним у домашній мережі.</li>
            <li>2. Постав PWA на телефон з цієї сторінки.</li>
            <li>3. Підключайся з телефону до свого компʼютера, коли він увімкнений.</li>
          </ol>
          <p className="mt-4 text-xs text-[var(--muted)]">
            Акаунт: <span className="text-[var(--fg)]">{user.email}</span>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
