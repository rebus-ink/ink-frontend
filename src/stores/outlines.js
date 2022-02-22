import { page } from "./page";
import { derived, writable } from "svelte/store";
import { error } from "./error.js";
import { fetch } from "./fetch.js";

export const refreshOutlines = writable(Date.now());
export const searchOutlines = writable();

export const outlines = derived(
  [page, refreshOutlines, searchOutlines],
  ([$page, $refreshOutlines, $searchOutlines], set) => {
    if (!process.browser) return;
    if (!$page.path || !$page.path.includes("/outlines/")) return;

    if ($page.query.returnTo) return;
    set({ type: "loading", items: [] });

    return fetch(`/api/outlines`)
      .then((lib) => {
        set(lib);
      })
      .catch((err) => {
        set({ type: "failed", items: [] });
        error.set(err);
        console.error(err);
      });
  },
  { type: "loading", items: [] }
);
