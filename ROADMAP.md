# Frontend Delivery Roadmap

## Current State

- Release status: `3.0.4` is tagged from `main`; Docker publication, Render
  deployment, and production dashboard smoke validation passed.
- The deprecated Create React App toolchain was replaced with Vite 7 and
  Vitest in the `2.0.0` release.
- Node `22.15.0` is pinned for local and Docker builds.
- Dependabot has no open alerts as of 2026-08-09.
- Drone validates pull requests by building, testing, and smoke-testing the
  Docker image. Trusted `dev` pushes publish development images; annotated tags
  on `main` publish production images and verify the deployed site.
- Production dashboard: `https://kernel528-welovemovies-dashboard.onrender.com/`.
- Production API: `https://kernel528-welovemovies.onrender.com/`.
- Render deploys the application as a Static Site from `main` using
  `npm ci && npm run build`, publishes `dist/`, and rewrites SPA routes to
  `/index.html`.

## Roadmap Status

| Phase | Status | Target / outcome |
| --- | --- | --- |
| Toolchain and security baseline | Complete | `2.0.0`: Vite, Vitest, safe review rendering, and zero open Dependabot alerts |
| Hero version indicator | Complete | `2.0.1`: application version displayed at the top-right of the hero banner |
| Container and CI delivery | Complete | Docker validation, Drone publication, tagged releases, and Render smoke checks |
| Render Static Site | Complete | Vite build published from `dist` with an SPA rewrite at the canonical dashboard URL |
| Render MCP review | Complete | Read-only service, deploy, logs, metrics, and Postgres inspection verified |
| List loading and error states | Complete | `2.0.2`: accessible movie and theater API loading and failure UI coverage |
| API resilience | Complete | `2.1.0`: reliable failed-request handling, movie detail cleanup, and all-movies loading/error coverage |
| Development image publication recovery | Complete | `2.1.1`: the repaired Drone webhook advances `dev-latest` after trusted `dev` pushes |
| Express 5 coordinated release and release verification | Complete | `3.0.4`: frontend contract validated against the Express 5 backend route and JSON error behavior; tagged deployment and dashboard smoke validation passed |
| Self-hosted production | Future | Evaluate static hosting, TLS, monitoring, rollback, and immutable image deployment |

## Delivery Policy

1. Create feature branches from `dev` using the `feature/<feature>` convention.
2. Require a passing Drone pull-request validation before merging to `dev` or
   `main`.
3. Treat `dev` as the development-image publication branch and `main` as the
   release branch.
4. Create an annotated version tag only on a reviewed `main` commit.
5. Never merge, tag, or deploy without explicit human approval.

## Delivered Capabilities

### Application Toolchain

- Vite 7 builds the React 17 application and emits `dist/` static assets.
- Vitest runs the API utility, navigation, and safe-review-rendering regression
  tests.
- JSX-bearing application and component-test files use the `.jsx` extension.
- `VITE_API_BASE_URL` is public build-time configuration and must never contain
  credentials.

### `2.0.1`: Hero Version Indicator

1. Reads the package version at build time and renders it at the top-right of
   the shared hero banner in `src/shared/Header.jsx`.
2. Keeps the indicator legible over the hero image on desktop and mobile
   without changing route navigation or hero copy.
3. Includes focused coverage confirming the rendered version matches the
   release metadata.
4. Was validated with Vitest, the Vite production build, and the Docker smoke
   test before release.

### `2.0.2`: List Loading And Error States

1. Shows accessible loading and failure UI while movie and theater lists are
   fetched.
2. Includes focused coverage for the list API states.

### `2.1.0`: API Resilience

1. Treats non-success API responses as errors and renders them in affected views.
2. Cancels movie detail requests on route changes and handles review mutation failures.
3. Adds all-movies loading/error states and regression coverage.

### Local And Container Validation

- The multi-stage Dockerfile uses Node `22.15.0`, runs `npm ci`, `vitest run`,
  and `vite build`, then serves `dist/` through Nginx.
- Nginx provides SPA route fallback, immutable static asset caching, and a
  `/health` endpoint.
- `npm run docker:build`, `npm run docker:run`, and `npm run docker:smoke`
  support the equivalent local validation flow.

### Drone Automation

- Pull requests build and smoke-test the container without Docker Hub
  credentials, then clean up the disposable container on either outcome.
- Trusted `dev` pushes publish immutable
  `dev-<commit>-drone-build-<number>` plus `dev-latest` Docker Hub tags.
- Tags verify that the target commit belongs to `main`, publish the release,
  immutable build, and `latest` tags, optionally invoke a configured Render
  deployment hook, and smoke-test the deployed frontend.

### Render Static Site

- The canonical dashboard is
  `https://kernel528-welovemovies-dashboard.onrender.com/`.
- Render builds the Vite bundle with `npm ci && npm run build`, publishes
  `dist/`, and rewrites SPA routes to `/index.html`.
- The prior Node Web Service remains a temporary learning environment. Its
  explicit Vite host allowlist does not apply to the Static Site.

### Security Maintenance

- The vulnerable `markdown` renderer was removed before the Vite migration;
  reviews now render as safe React text.
- Removing `react-scripts` removed the deprecated CRA dependency tree.
- The current dependency graph has no open Dependabot alerts.

## Image Tags

Use Docker Hub repository `kernel528/welovemovies-frontend`.

| Event | Tags |
| --- | --- |
| Merge/push to `dev` | `dev-${DRONE_COMMIT:0:8}-drone-build-${DRONE_BUILD_NUMBER}`, `dev-latest` |
| Version tag on `main` | `${DRONE_TAG}`, `${DRONE_COMMIT:0:8}-drone-build-${DRONE_BUILD_NUMBER}`, `latest` |

Commit/build tags are immutable release records. `dev-latest` and `latest` are
convenience tags, not a complete deployment record.

## Required Drone Configuration

- `docker_username`, `docker_password`, and `slack_webhook_drone_alerts`
- `production_api_base_url`
- `render_deploy_hook` only when a manual Render deploy is required
- Trusted repository access to `/var/run/docker.sock`

## Future Work

1. Replace the manually deployed `welovemovies-dev` stack with the
   Portainer-managed `welovemovies` stack from
   `docker-swarm/stacks/welovemovies-stack.yml`, using independently pinned
   backend and frontend image versions.
2. Add local reverse-proxy, TLS, and DNSexit records for
   `welovemovies-frontend-dev.kernelsanders.biz`. Build its development image
   with the matching development API URL because Vite embeds that value at
   build time.
3. Promote verified immutable images to a local production stack at
   `welovemovies-frontend.kernelsanders.biz` before replacing the Render Static
   Site.
4. Complete a staged Render-to-self-hosted cutover only after the target
   frontend and backend domains, CORS policy, security headers, monitoring, and
   rollback procedures are verified.
