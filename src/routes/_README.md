# `routes`

Sapper uses [file-based routing](https://sapper.svelte.dev/docs#Routing) which means that the names and directory structure of this directory will dictate what gets loaded and when.

One very useful and underused feature of Sapper is its ability to [preload state serverside](https://sapper.svelte.dev/docs#Preloading) so that the client-side SPA won't have to manage it specifically. We don't use this enough (only in the reading UI at the moment, IIRC) because when we started out it made navigation and loading animations and transitions harder. That isn't a limitation any more so you should probably move most routes to preload their state and that way dramatically cut down on the client-side stores you need (e.g. from `state` and `src/stores`).

## Note

Turns out adding a `README.md` file to the `routes` folder will break builds because, as noted above, Sapper uses file-based routing. So this file is named `_README.md` because Sapper ignores files whose filename begins with `_` when it comes to routing (you can still import them in `.js`, `.ts`, and `.svelte` files so that's a useful thing to know).
