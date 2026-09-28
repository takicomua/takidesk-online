import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getSessionUser } from "@/lib/auth";
import { site } from "@/lib/site";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <>
      <SiteHeader userName={user?.name} />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-16 sm:px-8">
        <section className="flex min-h-[78vh] flex-col justify-center gap-8 py-10">
          <div className="fade-up max-w-3xl space-y-5">
            <p className="font-display text-4xl font-extrabold tracking-tight text-[var(--accent)] sm:text-6xl md:text-7xl">
              {site.name}
            </p>
            <h1 className="max-w-2xl text-2xl font-semibold leading-snug text-[var(--fg)] sm:text-3xl md:text-4xl">
              {site.tagline}
            </h1>
            <p className="fade-up-delay max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              Зареєструйся, скачай додаток на ПК і постав PWA на телефон.
              Звʼязок іде напряму з твого компʼютера — ми не тягнемо твій екран через свої сервери.
            </p>
          </div>

          <div className="fade-up-delay-2 flex flex-wrap gap-3">
            <Link href={user ? "/dashboard" : "/register"} className="btn btn-primary">
              {user ? "Відкрити кабінет" : "Почати безкоштовно"}
            </Link>
            <a href="#how" className="btn btn-ghost">
              Як це працює
            </a>
          </div>

          <div
            className="fade-up-delay-2 pointer-events-none absolute inset-x-0 top-24 -z-10 mx-auto h-[42vh] max-w-5xl opacity-70"
            aria-hidden
          >
            <div className="absolute inset-0 rounded-[40%] bg-[radial-gradient(circle_at_30%_40%,rgba(200,241,53,0.18),transparent_55%),radial-gradient(circle_at_70%_50%,rgba(110,200,184,0.14),transparent_50%)] blur-2xl" />
          </div>
        </section>

        <section id="how" className="grid gap-10 py-8 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Один акаунт. Твій ПК. Твій телефон.
            </h2>
            <p className="max-w-xl text-[var(--muted)]">
              takiDesk Online — це зручний вхід і завантаження. Сам remote desktop лишається
              на твоєму ПК: безкоштовніше для тебе і легше для нас.
            </p>
          </div>

          <ol className="surface space-y-0 overflow-hidden rounded-3xl">
            {[
              {
                n: "01",
                t: "Реєстрація",
                d: "Створюєш акаунт за хвилину — email і пароль.",
              },
              {
                n: "02",
                t: "Додаток на ПК",
                d: "У кабінеті скачуєш takiDesk і ставиш на компʼютер.",
              },
              {
                n: "03",
                t: "PWA на телефон",
                d: "Встановлюєш сайт як додаток і підключаєшся до свого ПК.",
              },
            ].map((step) => (
              <li
                key={step.n}
                className="border-b border-[var(--line)] px-5 py-5 last:border-b-0 sm:px-6"
              >
                <div className="flex items-start gap-4">
                  <span className="font-display text-sm text-[var(--accent)]">{step.n}</span>
                  <div>
                    <p className="font-semibold">{step.t}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{step.d}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Без важкого трафіку",
              text: "Відео екрану не проходить через наші сервери — лише твій ПК і пристрій.",
            },
            {
              title: "Швидкий старт",
              text: "Акаунт → завантаження → підключення. Без купівлі домену і ручних тунелів.",
            },
            {
              title: "Під твоїм контролем",
              text: "Компʼютер лишається вдома. Ти вирішуєш, коли він онлайн.",
            },
          ].map((card) => (
            <article key={card.title} className="surface rounded-3xl p-5 sm:p-6">
              <h3 className="font-display text-xl font-bold">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{card.text}</p>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
