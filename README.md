[![Latest Version](https://img.shields.io/github/v/tag/kernel528/welovemovies-frontend)](https://github.com/kernel528/welovemovies-frontend/releases/latest)

# WeLoveMovies Frontend Application

This is the Front End Application for the WeLoveMovies project. Follow the instructions below.

## Project Repos

- Front-end app: https://github.com/kernel528/welovemovies-frontend
- Back-end app: https://github.com/kernel528/welovemovies-backend
- Local project root: `~/Projects/WeLoveMovies/`

## Current Baseline

- Latest release: `2.0.0` (2026-08-09).
- Toolchain: Vite 7, Vitest, React 17, and Node `22.15.0`.
- Dependabot alerts: none open (verified 2026-08-09).
- The `2.0.0` release replaces deprecated Create React App tooling and removes
  the former vulnerable Markdown renderer.

## Installation

1. Fork / clone this repository.
2. Run `npm install`.

Use `npm start` to run the Vite development server. If you deploy this
application, create a `.env.production` file similar to the `.env.development`
file.

## Docker And CI

Use Node `22.15.0`, as pinned in `.nvmrc`. Run `npm run test:ci` for the
non-interactive test suite. Build the static runtime image with
`npm run docker:build`, serve it locally with `npm run docker:run`, or build
and smoke-test it with `npm run docker:smoke`.

Drone validates pull requests targeting `dev` and `main` by testing, building,
and smoke-testing the Docker image. A trusted push to `dev` publishes
`kernel528/welovemovies-frontend:dev-<commit>-drone-build-<number>` and
`kernel528/welovemovies-frontend:dev-latest`. A version tag on `main` publishes
the version tag, an immutable commit/build tag, and `latest`, invokes the
Render production deploy hook, and verifies the deployed site.

Configure these repository secrets in `drone.kernelsanders.biz`:

- `docker_username`
- `docker_password`
- `slack_webhook_drone_alerts`
- `development_api_base_url`
- `production_api_base_url`
- `render_deploy_hook`
- `production_frontend_url`

The Drone repository must be trusted for access to `/var/run/docker.sock`.
`VITE_API_BASE_URL` is public build-time configuration and is embedded in
the generated JavaScript bundle; do not place credentials in this value.

## Render Deployment

Deploy this Vite application to Render as a Static Site, not a Node Web Service.
The checked-in `render.yaml` declares the production configuration:

- Canonical dashboard: `https://kernel528-welovemovies-dashboard.onrender.com/`
- Service: `kernel528-welovemovies-dashboard`
- Branch: `main`
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- SPA route rewrite: `/*` to `/index.html`

`VITE_API_BASE_URL` is compiled into the bundle from `.env.production` unless
Render supplies an overriding build environment variable. Do not configure a
start command: `npm start` runs Vite's development server, and the removed
`start-legacy` command belonged only to Create React App.
