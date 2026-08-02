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

Use `npm start-legacy` to run the application. If you deploy this application, create a `.env.production` file similar to the `.env.development` file.

## Deployment
I deployed this to Render.com as a Web Instance to connect to https://kernel528-welovemovies.onrender.com
Name:  `kernel528-WeLoveMovies-front-end`
- Updated the `.env.production` with setting for `REACT_APP_API_BASE_URL` to match deployed URL.
- As I was using http://www.render.com, during deployment setup on render.com, set the environment variable to match `.env.production` value.
