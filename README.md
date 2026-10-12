# Bootstrap 5 Dashboard Shell Demo

A small **React + TypeScript + Bootstrap 5** demonstration project.

> **Status: scaffold only.** The dashboard shell, Bootstrap Offcanvas, working profile form and browser checks are intentionally **not implemented yet**. This repository is not an implementation of a client's private project.

## Run locally

Requires Node.js `^20.19.0 || >=22.12.0` and npm.

```bash
npm ci
npm run check
npm run dev
```

Open the URL printed by Vite. For a production bundle:

```bash
npm run build
npm run preview
```

The app currently contains six connected routes, all using the same route registry:

- `/dashboard`
- `/dashboard/overview`
- `/dashboard/profile`
- `/dashboard/profile/professional`
- `/dashboard/work-contexts`
- `/dashboard/settings`

## Architecture choices

- **One route registry:** route metadata drives both the router and navigation; no per-role copies.
- **Constrained UI foundation:** Bootstrap 5 is the styling base. The future mobile navigation will use Bootstrap's **native Offcanvas**, not a reimplemented modal.
- **Explicit boundaries:** routing, pages, and future shared shell are separate. Pages must not duplicate the shell.
- **Frontend-only demo:** no API, persistence, RBAC, user accounts, credentials or confidential client assets.
- **No fabricated evidence:** the scaffold does not claim to pass keyboard, focus, responsive or QA-matrix tests that do not exist yet.

