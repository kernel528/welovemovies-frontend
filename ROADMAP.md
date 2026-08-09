# Frontend Delivery Roadmap

## Current State

- Latest release: `2.0.1`, published from `main` on 2026-08-09.
- The deprecated Create React App toolchain was replaced with Vite 7 and
  Vitest in the `2.0.0` release.
- Node `22.15.0` is pinned for local and Docker builds.
- Dependabot has no open alerts as of 2026-08-09.
- Drone validates pull requests by building, testing, and smoke-testing the
  Docker image. Trusted `dev` pushes publish development images; annotated tags
  on `main` publish production images and verify the deployed site.
- Render deploys the application as a Static Site from `main` using
  `npm ci && npm run build`, publishes `dist/`, and rewrites SPA routes to
  `/index.html`.

## Roadmap Status

| Phase | Status | Target / outcome |
| --- | --- | --- |
| Toolchain and security baseline | Complete | `2.0.0`: Vite, Vitest, safe review rendering, and zero open Dependabot alerts |
| Hero version indicator | Complete | `2.0.1`: application version displayed at the top-right of the hero banner |
| Container and CI delivery | Complete | Docker validation, Drone publication, tagged releases, and Render smoke checks |
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
  immutable build, and `latest` tags, invoke the configured Render deployment
  hook, and smoke-test the deployed frontend.

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
- `development_api_base_url` and `production_api_base_url`
- `render_deploy_hook` and `production_frontend_url`
- Trusted repository access to `/var/run/docker.sock`

## Future Work

1. Evaluate a self-hosted static-site platform with TLS, monitoring, rollback,
   and immutable Docker image deployment.
2. Complete a staged Render-to-self-hosted cutover only after the target
   frontend and backend domains, CORS policy, and security headers are
   verified.
3. Expand focused UI and loading/error-state coverage as application behavior
   changes.
