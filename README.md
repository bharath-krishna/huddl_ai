# Huddl-ai assignment
## Social media app

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy using docker (Recommended)
.env.local file has been added in the repo, you can just run

```bash
> docker build -t huddl-ai .
> docker run -d --name huddl-ai -p 3000:3000 huddl-ai
```

and access http://localhost:3000/login

You need a jwt token to login. Use below sample jwts

```
JWT Tokens

Bharath

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkJoYXJhdGgiLCJpZCI6InNxTDFPSkRubmNxTkVGV1lTeEFaIiwiaWF0IjoxNjE5NTA1ODIxLCJleHAiOjE2MjA1MDU4MjF9.x49Wt89fod751sIahASYTu6XKPRlhJlqNl0i18t4qFU


Sanjay

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNhbmpheSIsImlkIjoialo5MkozaE5nQVNlMnVSRENCUW4iLCJpYXQiOjE2MTk1MDU4MjEsImV4cCI6MTYyMDUwNTgyMX0.oDimnvv40Ji7sWevG2ah-8OKF1Vn0kcODrbrqAL1ldI


Anitha

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFuaXRoYSIsImlkIjoidG9DR1hBUEFySHZuQzg1NzVqYzQiLCJpYXQiOjE2MTk1MDU4MjEsImV4cCI6MTYyMDUwNTgyMX0.7cHKuujHPm2_LevQBReGKfTcipEes8twZ4B4PR6kgkA

```
These tokens are valid till 9 May 05:30 GMT, you can regenerate token by modifying "exp" in payload for testing purposes.


## How to stop and remove

```bash
> docker stop huddl-ai
> docker rm huddl-ai
```


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

I have also deployed in vercel, can be accessed here https://huddl-ai.vercel.app/login
(Note: performance may be affected due to network issues.)


### END


