# Математический Квиз "Я знаю математику!"

Интерактивный квиз с вопросами по математике (арифметика, алгебра, геометрия, тригонометрия).

## Технологии

- Next.js 15.x
- React 19.x
- TypeScript
- Tailwind CSS
- Firebase (Firestore)

## Настройка Firebase

1. Создайте проект в [Firebase Console](https://console.firebase.google.com/)
2. Добавьте веб-приложение в ваш проект Firebase
3. Скопируйте настройки Firebase в файл `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Создайте коллекции в Firestore:
   - `questions` - для хранения вопросов
   - `leaderboard` - для хранения результатов

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Заполнение базы данных начальными вопросами
npm run seed

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен-сервера
npm run start
```

## Возможности

- Прохождение квиза с вопросами различной тематики
- Таблица лидеров с результатами
- Административная панель для управления вопросами
- Хранение данных в Firebase

## Административная панель

Для доступа к административной панели используйте:
- URL: `/admin`
- Пароль: `amabru69`

В панели администратора можно:
- Добавлять новые вопросы
- Редактировать существующие вопросы
- Удалять вопросы

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
