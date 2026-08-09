[![Latest Version](https://img.shields.io/github/v/tag/kernel528/welovemovies-frontend)](https://github.com/kernel528/welovemovies-frontend/releases/latest)

# WeLoveMovies Frontend Application

This is the Front End Application for the WeLoveMovies project. Follow the instructions below.

## Project Repos

- Front-end app: https://github.com/kernel528/welovemovies-frontend
- Back-end app: https://github.com/kernel528/welovemovies-backend
- Local project root: `~/Projects/WeLoveMovies/`

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

Drone validates pull requests targeting `dev` and `main` by building and
smoke-testing the Docker image. A trusted push to `dev` publishes
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

## Deployment
I deployed this to Render.com as a Web Instance to connect to https://kernel528-welovemovies.onrender.com
Name:  `kernel528-WeLoveMovies-front-end`
- Updated the `.env.production` with setting for `VITE_API_BASE_URL` to match deployed URL.
- As I was using http://www.render.com, during deployment setup on render.com, set the environment variable to match `.env.production` value.
