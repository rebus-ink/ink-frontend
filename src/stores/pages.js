import { page } from "./page";
import { derived, writable } from "svelte/store";
import { error } from "./error.js";
import { fetch } from "./fetch.js";

export const refreshPages = writable(Date.now());
export const searchPages = writable();

export const pages = derived(
  [page, refreshPages, searchPages],
  ([$page, $refreshPages, $searchPages], set) => {
    if (!process.browser) return;
    if (!$page.path || !$page.path.startsWith("/notebooks")) return;
    if ($page.query.returnTo) return;
    set({ type: "loading", items: [] });

    return fetch(`/api/outlines?notebook=${$page.params.id}`)
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
