# PokeProject Battle Arena

Requires Node.js 22.13 or newer (uses the built-in SQLite module).

From `pokemon-tcg`, install and run the app:

```sh
npm install
npm run runprod
```

Open http://localhost:5001. New visitors see login and can switch to registration.
Usernames are case-sensitive, with 3–24 letters, numbers, or underscores. New
passwords require 8–128 characters and must be entered twice. Registration signs the user in and opens
`/home`, which links to cards and the deck builder. The top bar's Menu dropdown
contains navigation links and Log out.

Choose **Forgot password?** on the login form to reset a password using the
username and a new password entered twice. Successful resets return to login and
invalidate all sessions for that user.

For development, run `npm start` for the API and `npm run dev` in a second
terminal for Vite at http://127.0.0.1:5173. Vite proxies `/api` to the backend.

The server creates `pokemon-tcg.db` in this directory (override with
`DATABASE_PATH`). Sessions expire after 24 hours
and use HttpOnly, SameSite cookies. Set `NODE_ENV=production` when serving over
HTTPS to enable Secure cookies.

Run `npm test` for database and HTTP authentication integration checks and
`npm run build` for the production bundle. The HTTP tests stub TCGdex responses;
the live card service still requires network access.

## Original template notes

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
