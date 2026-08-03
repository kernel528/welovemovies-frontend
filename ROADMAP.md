# Frontend CI/CD Roadmap

## Purpose

Establish Docker-based validation and release automation for the We Love
Movies frontend through `drone.kernelsanders.biz`, after the backend pipeline
is operating reliably.

## Delivery Policy

1. Create `dev` from `main` before enabling feature work.
2. Create feature branches from `dev` using the `dev/<feature>` convention.
3. A pull request from `dev/<feature>` to `dev` runs Drone validation and must
   pass before review and merge.
4. A merge into `dev` triggers trusted development-image publication.
5. A pull request from `dev` to `main` runs validation and must pass before
   review and merge.
6. Do not publish a production image from a `main` push. Create an annotated
   version tag on the reviewed `main` commit instead.
7. A version tag on `main` publishes the production image. Production
   deployment automation will follow the backend delivery model.
8. Never merge into `dev` or `main`, tag a release, or deploy without explicit
   human approval.

## Dependencies and Constraints

1. Implement the backend CI/CD roadmap first so the frontend has a stable,
   versioned API image and defined deployment URL.
2. The project uses Create React App 5 and has no Node runtime pin. Add and
   validate a pinned Node version before CI is relied upon. Node 20 is the
   initial conservative target; test Node 22 separately before adopting it.
3. `REACT_APP_API_BASE_URL` is compiled into the browser bundle at build time.
   Each environment image must be built with its intended public API URL.
4. There are no current frontend test files. Build validation is useful, but
   focused tests must be added before test status is considered a meaningful
   regression gate.

## Image Tags

Use Docker Hub repository `kernel528/welovemovies-frontend`.

| Event | Tags |
| --- | --- |
| Merge/push to `dev` | `dev-${DRONE_COMMIT:0:8}-drone-build-${DRONE_BUILD_NUMBER}`, `dev-latest` |
| Version tag on `main` | `${DRONE_TAG}`, `${DRONE_COMMIT:0:8}-drone-build-${DRONE_BUILD_NUMBER}`, `latest` |

## Phase 1: Baseline Application Quality

1. Add `.nvmrc` and, if useful, an `engines` field that pin the selected Node
   runtime.
2. Add a non-interactive test script that runs
   `CI=true react-scripts test --watchAll=false`.
3. Add focused tests for the API utility, route rendering, loading/error state,
   and one representative movie interaction.
4. Ensure tests mock network calls and do not depend on Render, local backend,
   or Docker Hub availability.
5. Run `npm ci`, the non-interactive test command, and `npm run build` locally
   with an explicit development API base URL.

## Phase 2: Container Build and Local Verification

1. Add a multi-stage `Dockerfile`.
2. The build stage must use the pinned Node runtime, run `npm ci`, execute the
   non-interactive test command, and run `npm run build`.
3. Accept `REACT_APP_API_BASE_URL` as an explicit build argument and expose it
   only during the static bundle build.
4. Serve the generated `build` directory from a minimal static HTTP image.
5. Add a server configuration that supports SPA route fallback, static asset
   caching, and an HTTP health endpoint or root-page smoke check.
6. Add `.dockerignore` for `node_modules`, `build`, Git metadata, local env
   files, coverage, and editor artifacts.
7. Add npm scripts for local Docker image build and container smoke testing.

## Phase 3: Drone Validation Pipeline

1. Add `.drone.yml` with a Docker runner pipeline named `validation`.
2. Trigger it for pull requests targeting `dev` and `main`.
3. Build the Docker image with an explicit non-production
   `REACT_APP_API_BASE_URL` suitable for static validation.
4. Treat a failed dependency install, test command, or CRA production build as
   a failed image build.
5. Run the resulting image as a uniquely named disposable container and probe
   the root document and an SPA route.
6. Always remove the container in a status-independent cleanup step.
7. Notify Slack using `slack_webhook_drone_alerts` for successful and failed
   builds.

Pull-request validation must not publish images or access Docker Hub secrets.

## Phase 4: Development Image Publishing

1. Add a trusted pipeline triggered only by a `push` to `dev`.
2. Rebuild, test, and smoke-test before publishing the two development tags.
3. Build with the approved development backend API URL supplied by Drone
   configuration or a protected secret.
4. Publish using `docker_username` and `docker_password` Drone secrets.
5. Log the immutable image tag and compiled API base URL without exposing
   credentials.

## Phase 5: Production Release Pipeline

1. Add a tag-only pipeline and verify the tagged commit belongs to `main`.
2. Rebuild, test, build the static site with the production API URL, and
   smoke-test the image before publication.
3. Publish `${DRONE_TAG}`, the immutable build tag, and `latest` to
   `kernel528/welovemovies-frontend`.
4. Deploy only after the backend release is healthy and its public API URL is
   confirmed.
5. Run a post-deployment smoke test for the frontend document, SPA routing,
   and a browser-to-API request.

## Required Drone Configuration

1. Connect `kernel528/welovemovies-frontend` to `drone.kernelsanders.biz` and
   enable GitHub webhook delivery.
2. Configure `docker_username`, `docker_password`, and
   `slack_webhook_drone_alerts` as repository secrets.
3. Store the development and production `REACT_APP_API_BASE_URL` values in
   protected Drone configuration or secrets, rather than relying on committed
   environment files for release builds.
4. Confirm the Docker runner can access the host Docker socket and required
   image registries.
5. Configure GitHub branch protection for `dev` and `main` to require Drone
   validation and pull request review.

## Phase 6: Future Self-Hosted Production Migration

1. Provision a private static-site hosting platform, reverse proxy, TLS,
   firewall rules, monitoring, and a rollback process.
2. Deploy the frontend at `welovemovies.kernelsanders.biz` and
   `welovemovies.kernelsanders.us` using immutable Docker image tags.
3. Build production images with the migrated backend domains:
   `welovemovies-backend.kernelsanders.biz` and
   `welovemovies-backend.kernelsanders.us`.
4. Configure backend CORS, frontend security headers, and TLS before DNS
   cutover.
5. Perform a staged Render-to-self-hosted migration with smoke tests, rollback
   DNS records, and a documented decommission decision.

## Completion Criteria

1. Every PR to `dev` and `main` has a passing Docker-based test, build, and
   static-site smoke-test status in Drone.
2. Every `dev` merge publishes traceable development image tags.
3. Every approved version tag on `main` publishes the specified production
   tags and runs the agreed deployment verification.
4. Production builds use an explicit, reviewable API base URL and do not embed
   confidential configuration.
