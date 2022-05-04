import { page } from "./page";
import { derived, writable } from "svelte/store";
import { error } from "./error.js";
import { fetch } from "./fetch.js";
import { goto } from "@sapper/app";

export const refreshNotes = writable(Date.now());
export const refreshSourceNotes = writable(Date.now());
export const searchNotes = writable();
export const selectedNotebooks = writable([]);
export const selectedSource = writable();

export const notes = derived(
  [page, refreshNotes, searchNotes],
  ([$page, $refreshNotes, $searchNotes], set) => {
    if (!process.browser) return;
    if (!$page.path || !$page.path.startsWith("/notes")) return;
    if ($page.query.returnTo) return;
    set({ type: "loading", items: [] });
    const query = Object.assign({}, $page.query);
    if ($page.params.collection && $page.params.collection !== "all") {
      query.stack = $page.params.collection;
    } else if ($page.params.workspace && $page.params.workspace !== "all") {
      query.workspace = $page.params.workspace.replace("_", " ");
    }
    query.notMotivation = "bookmarking";

    if ($searchNotes) {
      query.search = $searchNotes;
      if (parseInt(query.page) > 1) {
        goto($page.path)
      }
      query.page = "1";
    } else if ($page.query.search) {
      query.search = $page.query.search;
      if (parseInt(query.page) > 1) {
        goto($page.path)
      }
      query.page = "1";
    }

    let url;
    if (query) {
      url = `/api/notes?${new URLSearchParams(query).toString()}`;
    } else {
      url = `/api/notes`;
    }
    return fetch(url)
      .then((lib) => {
        // Note from Marie: this part broke the refreshNotes so I removed it. Not sure what
        // it was for, but it doesn't break anything.Leaving it for now in case it 
        // somehow breaks everything
        // if ($page.params.id) {
        //   const listNote = lib.items.find(
        //     (item) => item.shortId === $page.params.id
        //   );
        //   listNote.selected = true;
        // }
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

export const sourceNotes = derived(
  [page, refreshSourceNotes],
  ([$page, $refreshSourceNotes, $searchNotes], set) => {
    if (!process.browser) return;
    if (!$page.path || !$page.path.startsWith("/sources")) return;
    if ($page.query.returnTo) return;
    set({ type: "loading", items: [] });
    const query = Object.assign({}, $page.query);
    if ($page.params.collection && $page.params.collection !== "all") {
      query.stack = $page.params.collection;
    } else if ($page.params.workspace && $page.params.workspace !== "all") {
      query.workspace = $page.params.workspace.replace("_", " ");
    }
    query.notMotivation = "bookmarking";

    // if ($searchNotes) {
    //   query.search = $searchNotes;
    //   if (parseInt(query.page) > 1) {
    //     goto($page.path)
    //   }
    //   query.page = "1";
    // } else if ($page.query.search) {
    //   query.search = $page.query.search;
    //   if (parseInt(query.page) > 1) {
    //     goto($page.path)
    //   }
    //   query.page = "1";
    // } 

    let url;
    if (query) {
      url = `/api/notes/${$page.params.id}?${new URLSearchParams(query).toString()}`;
    } else {
      url = `/api/notes/${$page.params.id}`;
    }
    return fetch(url)
      .then((lib) => {
        // Note from Marie: this part broke the refreshNotes so I removed it. Not sure what
        // it was for, but it doesn't break anything.Leaving it for now in case it 
        // somehow breaks everything
        // if ($page.params.id) {
        //   const listNote = lib.items.find(
        //     (item) => item.shortId === $page.params.id
        //   );
        //   listNote.selected = true;
        // }
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

