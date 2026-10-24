# Security Remediation — 2026-10-24

## Scope

Address the Node.js TLS/decompression and eMudhra certificate guidance in the
Render advisory, plus fixable npm audit findings discovered in the repository.
Render serves this application as a static site; Node.js is used to build the
site, not to serve application requests. No PHP runtime was found.

## Remediations in this branch

- Pin local development and the Docker build stage to Node.js `22.23.4`.
- Update Vite, Vitest, and the affected source-map dependency to patched
  compatible releases; `npm audit` reported zero vulnerabilities after the
  update.
- Update the Node.js runtime version documented in the project README and
  roadmap.

## Validation plan and status

1. Build the local Docker image and run its HTTP smoke test.
2. Run frontend tests, the production Vite build, and `npm audit`.
3. Submit this branch for PR review; do not promote before validation and review.
4. After approval and merge, trigger a Render Static Site production rebuild
   from the reviewed commit and verify the deployed dashboard and API
   integration.

Frontend tests, production build, Docker image smoke test, and `npm audit` have
passed. Production deployment has not been performed as part of this
remediation.
