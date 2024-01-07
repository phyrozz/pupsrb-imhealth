# PUP Santa Rosa Campus Student Mental Health Data Analysis and Online Monitoring System

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

Create an `.env.local` file on the root folder of the project and add this code:
```
NEXT_PUBLIC_SUPABASE_URL="YOUR SUPABASE PROJECT URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR SUPABASE PROJECT KEY"
```
***This part is important as this web app cannot communicate to the database if the Supabase URL and key are not specified within the project***

Finally, open [http://localhost:3000](http://localhost:3000) with your browser to see the web app on your test environment.
