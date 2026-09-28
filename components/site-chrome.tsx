import Link from "next/link";
import { site } from "@/lib/site";
import { logoutAction } from "@/lib/actions";

export function SiteHeader({
  userName,
}: {
  userName?: string | null;
}) {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <Link href="/" className="group flex items-baseline gap-2">
        <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          takiDesk
        </span>
        <span className="rounded-full border border-[var(--line)] px-2 py-0.5 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] transition group-hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--line))] group-hover:text-[var(--accent)]">
          Online
        </span>
      </Link>

      <nav className="flex items-center gap-2 sm:gap-3">
        {userName ? (
          <>
            <Link href="/dashboard" className="btn btn-ghost !px-3 !py-2 text-sm">
              Кабінет
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="btn btn-ghost !px-3 !py-2 text-sm">
                Вийти
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost !px-3 !py-2 text-sm">
              Увійти
            </Link>
            <Link href="/register" className="btn btn-primary !px-3 !py-2 text-sm">
              Реєстрація
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 mx-auto mt-auto w-full max-w-6xl px-5 py-10 text-sm text-[var(--muted)] sm:px-8">
      <div className="flex flex-col gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. Стрім іде з твого ПК.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/privacy" className="hover:text-[var(--fg)]">
            Конфіденційність
          </Link>
          <Link href="/terms" className="hover:text-[var(--fg)]">
            Умови
          </Link>
          <span className="text-[var(--teal)]">Без медіа-ретрансляції</span>
        </div>
      </div>
    </footer>
  );
}
