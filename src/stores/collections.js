import { derived, writable } from "svelte/store";
import { error } from "./error.js";
import { fetch } from "./fetch.js";

export const refreshCollections = writable(Date.now());

export const tags = derived(refreshCollections, ($refreshCollections, set) => {
  let items = [];
  function getIds(names) {
    return items.filter(item => names.includes(item.name)).map(item => item.id);
  }
  set({ items, getIds });
  if (!process.browser) return;
  return fetch("/api/collections")
    .then(lib => {
      items = lib;
      set({ items, getIds });
    })
    .catch(err => {
      set({ items, getIds });
      error.set(err);
      console.error(err);
    });
});

export const collections = derived(tags, ($tags, set) => {
  const stacks = $tags.items
    .filter(tag => tag.type === "stack")
    .sort((a, b) => getName(a.name).localeCompare(getName(b.name)));
  set(stacks);
});

export const addedCollections = writable([]);


const spaces = ["Research", "Public_Scholarships", "Teaching", "Personal"];
function getName(name) {
  const space = name.split("/")[0].replace(" ", "_");
  if (spaces.includes(space)) {
    return name.replace(space + "/", "");
  } else {
    return name;
  }
}
