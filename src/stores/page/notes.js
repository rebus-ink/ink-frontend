import { page } from "../page";
import { derived, writable } from "svelte/store";
import { error } from "../error.js";
import { fetch } from "../fetch.js";

export const refreshPageNotes = writable(Date.now());
export const searchPageNotes = writable();

export const pageNotes = derived(
  [page, refreshPageNotes, searchPageNotes],
  ([$page, $refreshPageNotes, $searchPageNotes], set) => {
    if (!process.browser) return;
    if (!$page.path || !$page.path.startsWith("/outlines/")) return;
    if ($page.query.returnTo || !$page.query.notebook) return;
    set({ type: "loading", items: [] });
    const query = Object.assign({}, $page.query);

    if ($searchPageNotes) {
      query.search = $searchPageNotes;
    } else if ($page.query.search) {
      query.search = $page.query.search;
    }

    const url = query
      ? `/api/notes?${new URLSearchParams(query).toString()}`
      : "/api/notes";

    return fetch(url)
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
