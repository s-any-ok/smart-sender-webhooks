# Smart Sender — Webhooks (Senior Frontend test task)

A small app: sign-in, a webhook list with search and pagination, and webhook editing.
The API is fully mocked with **MSW** according to the contract from the task.

## Getting started

Requires Node.js **22.12+** (see `.nvmrc`).

```bash
nvm use
npm install
npm run dev        # http://localhost:5173
```

| Command             | What it does                                     |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | dev server (the MSW worker starts automatically) |
| `npm test`          | automated tests (Vitest + `msw/node`)            |
| `npm run typecheck` | `tsc -b` in strict mode                          |
| `npm run lint`      | ESLint, including FSD layer boundary checks      |
| `npm run build`     | typecheck + production build                     |

### Test credentials

```
email:    admin@smartsender.dev
password: password123
```

A wrong password returns 422 with an error under the password field; an unknown email returns an
error under the email field. The UI itself is in Ukrainian.

### Checking the session manually

The session lives for 30 seconds, so you can see the rotate in the Network tab just by waiting.
To skip the wait, the mock state is exposed in the browser console in dev mode:

```js
__mock.expireSession(); // session expired → next request: 401 → rotate → retry
__mock.state.session = null; // session revoked on the server → rotate 400 → sign-in screen
__mock.changeCsrfToken(); // next POST/PUT gets 419 → new /csrf → retry
```

## Test

`src/app/providers/sessionRotation.test.ts` runs the real MSW handlers in Node:

1. **Required:** two parallel requests (`/v1/me` and `/v1/webhooks`) get 401 →
   **exactly one** `/auth/token/rotate` is made → both requests are retried successfully
   (once each).
2. Rotate returns 400 → both requests fail, there was a single rotate, and the local session ends
   with the `expired` reason.
3. 419 → another `GET /csrf` → a single `PUT` retry.

The test was mutation-checked: if the shared rotate is removed, the first case fails.

## Architecture — Feature-Sliced Design

```
src/
├─ app/        providers, router and guards, global styles, wiring httpClient to the session
├─ pages/      login, webhooks, webhook-edit, not-found — thin composition pages
├─ widgets/    app-header, webhooks-list (search + table + states + pagination)
├─ features/   auth-by-email, logout, webhook-filters (list state in the URL), edit-webhook
├─ entities/   session, user, webhook — types, API, query keys, basic hooks/UI
└─ shared/     api (transport), UI kit, lib, config, mocks (MSW)
```

- A layer imports only from the layers below it; slices are consumed only through their public
  API (`index.ts`). Both rules are **enforced by ESLint** (built-in `no-restricted-imports` with a
  separate set of restrictions per layer), not just by convention.
- Slice segments: `api/`, `model/` (store, hooks, types), `lib/`, `ui/`. One component per file;
  hooks live only in `model/`.
- Separation of concerns: **transport and retries** — `shared/api`; **server state** — TanStack
  Query (`entities/*/api/*Queries.ts`); **client session state** — Zustand (`entities/session`);
  **list state** — the URL; the **UI** knows nothing about HTTP.

## Key decisions

### HTTP client (`shared/api/httpClient.ts`)

A thin wrapper over `fetch`: all retry logic lives in a single `request()` loop, with no
interceptors that are hard to follow.

- Every request sends `X-Requested-With: XMLHttpRequest`.
- **CSRF:** `GET /csrf` runs before the very first request; parallel requests await the same
  promise (single-flight). The token is attached to POST/PUT. On **419** the token is invalidated
  (only if nobody has refreshed it yet) and the request is retried **at most once**.
- **401 → rotate:**
  - protected requests call `refreshSession()` on 401 and are retried **once**;
  - parallel 401s share **one rotate** (`createSingleFlight`);
  - auth endpoints (`login`, `issue`, `rotate`, `revoke`) are marked `auth: false`, so rotate
    never triggers another rotate;
  - **session generation counter:** a request remembers the generation it was sent with. If its
    401 arrives _after_ a rotate has already finished (a slow response), the request is simply
    retried without a new rotate;
  - new requests wait for an in-flight rotate instead of running into a guaranteed 401;
  - a failed rotate or a repeated 401 → `onSessionExpired()` (once per failed rotate).
- `shared` doesn't depend on `entities`: `refreshSession` and `onSessionExpired` are injected by
  the `app` layer (`setupHttpClient.ts`).
- Errors are a typed `ApiError` (`status`, `type`, `payload`) following the contract format.

### Session

- `device_session_token` lives only in memory (Zustand without persist) and is cleared after
  `issue`.
- `fingerprint` — 32 hex characters from `crypto.getRandomValues`, generated once, stored in
  `localStorage` (with a safe fallback if storage is unavailable), and sent in the body of auth
  requests.
- The client never sees session tokens: the session is kept by the mock (an HttpOnly cookie
  analogue).
- Sign-in: `login → issue → /v1/me → redirect`. After a page reload you need to sign in again (the
  mock state is in memory), but **the URL with `?page=&search=` is preserved** and the user is
  returned exactly there after signing in.
- The reason the session ended is tracked: after expiry there's a "session expired" banner and a
  return to the previous page; after an explicit logout the user starts clean.
- Logout: `revoke` (best effort — a failure doesn't block logout) → store reset →
  `queryClient.clear()`.

### List

- `page` and `search` live in the URL (`useWebhookListParams`); defaults aren't written to the
  address. Reload and back/forward work.
- Search: a local draft + 350 ms debounce; changing the search resets the page to the first one.
  On back/forward the input syncs with the URL and a pending commit is cancelled so it doesn't
  overwrite history. Enter commits immediately.
- `keepPreviousData`: while switching pages the table stays on screen (semi-transparent).
- States: loading, error with retry, empty search result, empty list, non-existent page.

### Editing

- A separate page, `/webhooks/:id`; the link passes the current `?page=&search=` via
  `location.state`, so "Back", "Cancel" and saving all return to the same list state.
- React Hook Form. The client only checks for empty values; the URL format is validated by the
  server on purpose, so server errors are visible. A 422 is mapped onto fields
  (`applyServerErrors`); unknown fields and other errors go to a form-level banner.
- After saving, the detail cache is updated and the lists are invalidated (a name change can affect
  search results).

### Mock (`shared/mocks`)

One user, 28 webhooks, in-memory state. All the rules are implemented: CSRF check before the
operation runs (419), `X-Captcha-Token` on login, a 30 s session extended by rotate, rotate → 400
before `issue` and after `revoke`, a one-time `device_session_token` bound to the fingerprint,
case-insensitive search, stable ordering, `results.total` after filtering. The same handlers are
used both in the browser (`msw/browser`) and in tests (`msw/node`).

### Stack

React 19, TypeScript (strict + `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), Vite,
React Router 7, TanStack Query 5, Zustand, React Hook Form, MSW 2, Vitest 5, ESLint 10. UI — a
minimal set of custom components on CSS Modules (no UI library, to avoid pulling in a dependency
for a handful of controls).
