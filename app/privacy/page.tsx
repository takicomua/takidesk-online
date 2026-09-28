import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getSessionUser } from "@/lib/auth";

export const metadata = { title: "Конфіденційність" };

export default async function PrivacyPage() {
  const user = await getSessionUser();
  return (
    <>
      <SiteHeader userName={user?.name} />
      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">Конфіденційність</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
          <p>
            takiDesk Online зберігає лише дані акаунта: імʼя, email та хеш пароля. Паролі в
            відкритому вигляді не зберігаються.
          </p>
          <p>
            Відео робочого столу та керування ПК не проходять через наші сервери — зʼєднання йде
            між твоїм пристроєм і твоїм компʼютером.
          </p>
          <p>
            Сесія тримається в захищеній httpOnly cookie. Ми не продаємо персональні дані третім
            сторонам.
          </p>
          <p>
            Для видалення акаунта напиши на email підтримки з адреси, якою реєструвався.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
