import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getSessionUser } from "@/lib/auth";

export const metadata = { title: "Умови використання" };

export default async function TermsPage() {
  const user = await getSessionUser();
  return (
    <>
      <SiteHeader userName={user?.name} />
      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">Умови використання</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
          <p>
            takiDesk Online надає акаунт і доступ до завантажень клієнтів. Ти відповідаєш за
            безпеку свого ПК, паролів і за те, кому надаєш доступ.
          </p>
          <p>
            Заборонено використовувати сервіс для несанкціонованого доступу до чужих систем,
            шкідливого ПЗ або порушення закону.
          </p>
          <p>
            Сервіс надається «як є». Ми можемо змінювати функції, ліміти та тарифи з попередженням
            у продукті.
          </p>
          <p>
            Remote desktop трафік обробляється на твоєму обладнанні. Ми не гарантуємо доступність
            твого домашнього ПК або мережі.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
