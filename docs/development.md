# Development Guide

## Prerequisites

* Node.js (specified by `engines.node` in `package.json`)

## Setup

The front-end can run against a local or hosted instance of the API server (recommended if
contributing the front-end only). To setup the front-end service for local development, clone this
repository and configure the follow files in the root of the application (source these from a team
member):

1. Google Service Account Key: `keyfile.json`
2. Environment Variables: `.env`. Update `GOOGLE_APPLICATION_CREDENTIALS` to point to the correct path.

Install the Node modules:

    $ npm install

Run the front-end development server:

    $ npm run dev # this may take a few seconds to start-up

Visit http://localhost:3000/login to sign-up or login.

**WARNING**: Do not visit http://localhost:3000/ to login as you'll experience
this [documented issue](https://github.com/RebusFoundation/ink-library/issues/202).

## TypeScript

When working on TypeScript code, you'll want to run the TypeScript compiler:

To run:

    $ npm run typescript

Or to watch:

    $ npm run watch:typescript

## Testing

To run:

    $ npm run test

Or to watch:

    $ npm run watch:test

## `npm` Scripts

|         Name          |                                                  Description                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| `dev`                 | runs the sapper dev server                                                                                     |
| `build`               | builds the typescript files, the sapper app, and if necessary will also save the Google Cloud keyfile from env |
| `build:typescript`    | builds typescript files                                                                                        |
| `export`              | `sapper export --legacy`                                                                                       |
| `start`               | starts the built server, make sure to run `build` first                                                        |
| `lint`                | runs the `healthier` linter and `svelte-check`                                                                 |
| `snapshots`           | updates the test snapshots                                                                                     |
| `test`                | runs the tests                                                                                                 |
| `watch:test`          | runs the tests in watch mode                                                                                   |
| `watch:typescript`    | runs the typescript compiler in watch mode                                                                     |
| `watch`               | runs all watch scripts in parallel                                                                             |
| `deploy-function`     | deploys the production google cloud function for uploads                                                       |
| `deploy-dev-function` | deploys the dev google cloud function for uploads                                                              |
| `deploy-dev`          | deploys the app to development                                                                                 |
| `deploy-production`   | deploys the app to production                                                                                  |
| `save-config`         | saves the app.yaml config file from env, used by the GitHub Action for automatic deployments                   |
| `save-keyfile`        | saves the keyfile from env, necessary if hosting outside of the Google Cloud Platform                          |
