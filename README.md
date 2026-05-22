# Playtime

Next.js (React) + TypeScript + Tailwind CSS + [shadcn/ui](https://ui.shadcn.com).

## Эхлэх

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) дээр нээгдэнэ.

## shadcn/ui компонент нэмэх

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add dialog
```

Бүх боломжит компонент: [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

## Бүтэц

| Зам | Тайлбар |
|-----|---------|
| `src/app/` | Next.js App Router хуудсууд |
| `src/components/ui/` | shadcn/ui компонентууд |
| `src/lib/utils.ts` | `cn()` utility |
| `components.json` | shadcn тохиргоо |

## Scripts

- `npm run dev` — хөгжүүлэлт
- `npm run build` — production build
- `npm run start` — production сервер
- `npm run lint` — ESLint
