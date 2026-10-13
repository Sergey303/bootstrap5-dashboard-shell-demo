# Demo projects

Independent frontend demos. Each application has its own `package.json`, toolchain, and build commands.

## Projects

| Project | Description | Source |
| --- | --- | --- |
| [bootstrap5](bootstrap5/) | React + Bootstrap 5 dashboard shell, six routes, responsive navigation, editable profile, and Playwright tests | Included in this repository |
| [GosVet](GosVet/) | Veterinary clinic single-file React demo built with PrimeReact | Private Git submodule from [Sergey303/GosVet](https://github.com/Sergey303/GosVet) |

## Bootstrap 5

```bash
cd bootstrap5
npm ci
npm run dev
```

Run typechecking, lint and build from the same directory:

```bash
npm run check
npm run lint
npm run build
```

See [Bootstrap 5 demo README](bootstrap5/README.md) for screenshots, routes, and browser tests.

## GosVet (private submodule)

The `GosVet/` entry is a **Git submodule**, not a copy of its contents. The original repository remains private, including its business documentation and Git history. Access to the original repository is required to clone or build this submodule.

```bash
git clone --recurse-submodules https://github.com/Sergey303/demo.git
cd demo/GosVet
npm ci
npm run build
```

For a checkout that already exists:

```bash
git submodule update --init GosVet
```

The original GosVet source is not published by this public demo repository. If GosVet is to be shown publicly, review its source and business documents before converting it to a regular project directory.

## Repository layout

```text
demo/
  bootstrap5/         # Full Bootstrap 5 project
  GosVet/             # Private Git submodule
  .gitmodules
  README.md
```

The projects are intentionally independent; do not run `npm install` at the repository root.
