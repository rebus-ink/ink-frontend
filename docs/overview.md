# Overview

A [Svelte](https://svelte.dev/) Single-Page App with Server-Side Rendering (SSR).
## Feature Summary

The base route maps the feature to the path located in `src/routes`.

|      Feature      |                       Description                        |  Base Route  |
| ----------------- | -------------------------------------------------------- | ------------ |
| Dashboard         | Recent sources, notes, notebooks                         | `/`          |
| Source Library    | Source documents and other media                         | `/library`   |
| Note Library      | Notes added to sources                                   | `/notes`     |
| Notebooks Library | Collects sources, notes and pages                        | `/notebooks` |
| Reader UI         | View, bookmark and annotate sources                      | `/sources`   |
| Pages             | Create outlines (mindmaps and affinity maps coming soon) | `/pages`     |
| Reader Profile    | Reader profile including activity and login information  | `/readers`   |
| Advanced Search   | Search across sources, notes and notebooks               | `/search`    |

## Key Components

|     Component      |                                         Description                                          |
| ------------------ | -------------------------------------------------------------------------------------------- |
| Authentication     | Implemented with `passportjs` and `Auth0` (although other `passportjs` adapters can be used) |
| Session management | Implemented with `express-session`.                                                          |

## API Endpoints `/api/**`

- API endpoints that provide request pre-processing and proxying to the [Rebus Ink API server](https://github.com/RebusFoundation/reader-api)
- Signed URL generation for direct uploading to a Google Storage bucket (other storage backends aren't supported)
- A Google Cloud Function that processes uploaded files and turns them into more easily processable JSON files (using [`ink-engine`](https://github.com/RebusFoundation/ink-engine)). Found at [`functions/onfinalize/index.js`](functions/onfinalize)
- A `read` endpoint that takes those processed JSON files, matches annotations to the server-rendered HTML (using `ink-engine` and [`rehype-annotate`](https://github.com/RebusFoundation/rehype-annotate))

## Directory Structure

- `components/widgets`: commonly used widgets (should probably be moved into `src`)
- `functions/onfinalize`: the Cloud Function that processes uploads deploy to dev or production using `npm run deploy-dev-function` and `npm run deploy-function` respectively with that directory as the current working directory
- `sapper`: the build target. This is the code that will actually get deployed. (We use 'sapper' instead of the default '**sapper**' because Google App Engine's Standard Environment has problems with '\_' in filenames).
- `src`: This is where most of the code lives excluding the newer state and style code (see below)
  - `src/components`: where most of the app lives
  - `src/routes`: Sapper uses file-based routing using the files in this directory. The `src/routes/sources/**` endpoints also preload state server-side, simplifying state management, which is something the other routes should probably switch to doing long term.
    - `src/routes/_layout.svelte`: this is the main svelte component that wraps every route
  - `src/stores`: where our [Svelte stores](https://svelte.dev/docs#svelte_store) live. This is where the state for most of the endpoints and components is managed
  - `src/auth.js`: sets up authentication
  - `src/client.js`: sets up client-side rendering
  - `src/getToken.js`: a function that's used client-side to acquire the anti-CSRF token used to protect the `api/*` endpoints
  - `src/server.js`: starts the server, integrates auth and server setup
  - `src/service-worker.js`: the basic service worker code
  - `src/setup.js`: sets up the expressjs server app
  - `src/template.html`: the core page template for every single server-rendered page.
- `state`: this is where the newer state code lives. These directories contain Svelte stores created and managed using [`rxjs`](https://rxjs.dev/) which is best described as a sort of `lodash` for reactive stores. This is also where the client-side models and controllers were supposed to live.
  - `state/models/`: currently only houses the `Annotation` and `Bookmark` models and related utility functions which unify all methods for dealing with annotations into single TypeScript models. The plan was to migrate all api request code and state management code into models
  - `state/controllers`: currently only houses the `SelectionToolbar` controller which is an `rxjs` class (`BehaviorSubject`) that controls everything state-related for that component. Toolbar handlers are methods and it itself is a svelte store that always contains the current state for that component. The plan was to piecemeal, as each component was updated, switch to this Model-View-Controller architecture to make the complexity of the app easier to handle, long term.
  - `static`: static files for the front end. Contains a few vendored dependencies like polyfills and modal code.
  - `styles`: contains the base stylesheet code that's available to all components and pages. These are imported, in order, into the svelte-generated stylesheet on build which means that each level takes precedence over the lower levels.
    - `styles/01-settings` contains CSS variables.
    - `styles/02-tools` contains simple utility styles (only `.visually-hidden` at this point).
    - `styles/03-generic` contains code that sets up higher level CSS or is reused by higher level CSS.
    - `styles/04-elements` contains the style for specific elements. In effect this sets up our default global styles for each of these elements.
    - `styles/05-objects` contains CSS for specific landmarks that need to trump element code (only `#sapper` at the moment)
    - `styles/06-components` contains CSS for specific `.Class` components. Not really used because scoped svelte component CSS fulfils this use case.
  - `test` is where our tests live. Uses [`@web/test-runner`](https://modern-web.dev/docs/test-runner/overview/)
  - `dev.js` is not used
  - `index.js` is the app's primary entry point
  - `rollup.config.js` is the build setup for the app
  - `rollup.test.config.js` is not used since we switched to using a `svelte` plugin for `@web/test-runner`
  - `save-config.js` finds the env variable that stores the app.yaml for deployment and if it's there saves it as a file. Used by the GitHub action we use for automatic deploys.
  - `save-keyfile.js` finds an env variable that stores a Google keyfile.json and if it's there saves it as a file. To be used when hosting outside of the Google cloud but while still using Google Storage for uploads.
  - `tsconfig.json` is the TypeScript config file
  - `web-dev-server.config.js` sets up the server that `@web/test-runner` uses to process modules before handing off to the test runner
  - `web-test-runner.config.js` is config for the `@web/test-runner` test runner.
