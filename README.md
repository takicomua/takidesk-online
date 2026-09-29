# takiDesk Online

SaaS-портал: лендінг → реєстрація → кабінет (завантаження ПК + PWA).
Медіа remote desktop **не** проходить через цей сайт.

## Три кроки для користувача

1. Реєстрація акаунта  
2. Завантажити додаток на ПК  
3. Встановити PWA на телефон  

## Локально (з коробки)

```bash
npm install
npm run dev
```

Акаунти: `data/users/*.json` (gitignore). `AUTH_SECRET` у `.env.local` бажаний, але для dev є fallback.

## Прод на Vercel (обовʼязково)

1. `AUTH_SECRET` ≥ 32 випадкові символи (Production / Preview / Development)  
2. Blob Store (private) → `BLOB_READ_WRITE_TOKEN`  
3. (Опційно) `NEXT_PUBLIC_PC_DOWNLOAD_URL` на реальний інсталер  

Перевірка: `GET /api/health` → `{ "ok": true }`

## Безпека

- bcrypt (cost 12), httpOnly session cookie, SameSite=Lax  
- Приватні Blob на юзера (не один спільний JSON)  
- Rate limit на login/register  
- Security headers + CSP  
- Service worker кешує лише статику (не HTML кабінету)  
- Flash-помилки в cookie (не в URL)  

## Стек

Next.js · Vercel · JWT · Vercel Blob · PWA

## Розробник

[ndx.com.ua](https://ndx.com.ua)
