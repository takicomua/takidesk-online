# takiDesk Online

Сайт продукту: інформація, реєстрація, кабінет із завантаженням для ПК і PWA для телефону.

Окремий проєкт від desktop-агента `texnolodgia` / takiDesk. Медіа-трафік remote desktop **не** йде через цей сайт.

## Локально

```bash
npm install
npm run dev
```

Відкрий [http://localhost:3000](http://localhost:3000).

Акаунти зберігаються в `data/users.json` (локально, gitignore).

## Змінні оточення

Скопіюй `.env.example` → `.env.local`:

- `AUTH_SECRET` — секрет для сесій (обовʼязково на Vercel, мін. 16 символів)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob (на проді; локально не потрібен)
- `NEXT_PUBLIC_PC_DOWNLOAD_URL` — лінк на Windows-інсталер
- `NEXT_PUBLIC_ANDROID_DOWNLOAD_URL` — опційний лінк на APK

## Деплой

1. GitHub repo
2. Vercel project
3. Storage → Blob store (підключить `BLOB_READ_WRITE_TOKEN`)
4. Env: `AUTH_SECRET`

## Стек

Next.js · Vercel · JWT cookies · Vercel Blob (прод) / локальний JSON
