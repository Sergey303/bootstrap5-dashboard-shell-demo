# Bootstrap 5 Dashboard Shell Demo

Compact, frontend-only dashboard demonstrating how to extend an existing React and Bootstrap 5 application without replacing its UI foundation.

## Features

- Responsive layout: desktop sidebar and **native Bootstrap 5 Offcanvas** on mobile.
- Six connected routes, navigation and breadcrumbs driven by a single route registry.
- In-memory workspace selection (personal, product team and research).
- Profile details and an editable professional profile with inline validation and accessible feedback.
- Overview, activity and display settings using fictional demonstration data.
- Semantic HTML, keyboard navigation and mobile-menu focus restoration.
- Subtle action-button ripple feedback that respects reduced-motion preferences.

No backend, authentication, RBAC, API, persistence or real customer data is included.

## Run locally

Requires Node.js `^20.19.0 || >=22.12.0` and npm.

```bash
npm ci
npm run dev
```

The URL is printed by Vite. A production build can be verified with:

```bash
npm run check
npm run check:e2e
npm run lint
npm run build
```

## Browser tests

Playwright covers all six routes at 320, 375, 768, 1024, 1280 and 1440 CSS pixels. It also checks native Offcanvas / keyboard focus, workspace selection, form validation, fixed preview dimensions, pointer affordances and action icons.

By default, tests run in Chromium:

```bash
npx playwright install chromium
npm run test:e2e
```

For the **full three-browser matrix**, first install all browsers, then enable Chromium, Firefox and WebKit explicitly. That tests **108 route × viewport × engine combinations** plus the additional functional checks. If any browser is missing, the run fails instead of silently omitting a browser.

```bash
npx playwright install chromium firefox webkit
FULL_BROWSER_MATRIX=true npm run test:e2e -- --workers=1
```

PowerShell equivalent (after installing the browsers):

```powershell
$env:FULL_BROWSER_MATRIX = "true"
npm run test:e2e -- --workers=1
Remove-Item Env:FULL_BROWSER_MATRIX
```

Playwright WebKit tests the WebKit engine, not the Safari application on Apple hardware. Only checks actually executed should be reported as passed.

## Routes

| Route                             | Page                          |
| --------------------------------- | ----------------------------- |
| `/dashboard`                      | Dashboard home                |
| `/dashboard/overview`             | Workspace overview            |
| `/dashboard/profile`              | User profile                  |
| `/dashboard/profile/professional` | Editable professional profile |
| `/dashboard/work-contexts`        | Workspace selection           |
| `/dashboard/settings`             | Local display preferences     |

## Architecture

- **One route registry** in `src/routes.ts` drives the router, navigation and breadcrumbs.
- **One shared shell** in `src/shell/` provides responsive layout and accepts navigation, breadcrumbs, context selection and page content as slots.
- **Bootstrap-first UI:** the navigation drawer uses the Bootstrap Offcanvas JavaScript API and releases instances/listeners when unmounted. CSS overrides are narrowly scoped.
- **Feature boundaries:** navigation, forms, context state and individual pages remain separate.
- **Predictable data flow:** workspace state lives in a typed React context. Form state lives in its own component. Changes are ephemeral and reset when the page reloads.
- **Verification:** TypeScript, ESLint, production build and Playwright browser checks.

This is an independent demonstration with invented data, not an implementation of a private customer project.
